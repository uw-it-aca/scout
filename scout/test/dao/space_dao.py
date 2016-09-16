import datetime
from django.test.client import RequestFactory
import pytz
from django.test import TestCase
from django.test.utils import override_settings
from scout.dao.space import add_foodtype_names_to_spot, add_cuisine_names, \
    add_payment_names, add_additional_info, get_is_spot_open, organize_hours, \
    get_open_periods_by_day, get_spot_list, _get_spot_filters, OPEN_PERIODS,\
    get_spot_by_id, group_spots_by_building, get_avg_latlng_for_spots,\
    add_latlng_to_building, get_spots_by_filter, adjust_time_by_offset, \
    _get_period_filter
from spotseeker_restclient.spotseeker import Spotseeker
from scout.dao import space
from spotseeker_restclient.exceptions import DataFailureException
from spotseeker_restclient.models.spot import Spot, SpotAvailableHours

DAO = "spotseeker_restclient.dao_implementation.spotseeker.File"


@override_settings(SPOTSEEKER_DAO_CLASS=DAO)
class SpaceDAOTest(TestCase):

    def test_get_spots_by_filter(self):
        """ tests function used by discover cards to load spaces with
        selected filters. Uses mock data that matches order of this filter.
        """

        filters = [
                    ('limit', 5), ('center_latitude', u'47.653811'),
                    ('center_longitude', u'-122.307815'),
                    ('distance', 100000),
                    ('fuzzy_hours_start', 'Tuesday,05:00'),
                    ('fuzzy_hours_end', 'Tuesday,11:00'),
                    ('extended_info:app_type', 'food')
        ]

        spots = get_spots_by_filter(filters)
        self.assertEqual(len(spots), 5)
        self.assertEqual(spots[0].extended_info[3].value, 'food')

    def test_add_foodtypes(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = add_foodtype_names_to_spot(spot)
        self.assertEqual(spot.foodtype_names, ["Entrees", "Sandwiches"])

    def test_add_cuisine(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = add_cuisine_names(spot)
        self.assertEqual(spot.cuisinetype_names, ["Indian", "Vietnamese"])

    def test_add_payment(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = add_payment_names(spot)
        self.assertEqual(spot.payment_names, ["Cash", "Husky Card",
                                              "Mastercard", "Dining Account",
                                              "Visa"])

    def test_add_additional_info(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = add_additional_info(spot)
        self.assertEqual(spot.has_alert, None)
        self.assertEqual(spot.alert_notes, None)
        self.assertEqual(spot.has_reservation, None)
        self.assertEqual(spot.reservation_notes, None)
        self.assertEqual(
            spot.menu_url,
            "https://www.hfs.washington.edu/uploadedFiles/Dining/"
            "Dining_Locations/Bahnwebmenu%202014.pdf")
        self.assertEqual(spot.hours_notes, None)
        self.assertEqual(spot.access_notes, None)
        self.assertEqual(spot.has_coupon, None)
        self.assertEqual(spot.coupon_expiration, None)
        self.assertEqual(spot.coupon_url, None)
        self.assertEqual(spot.phone, "206-685-4950")
        self.assertEqual(
            spot.website_url, "https://www.hfs.washington.edu/dining/"
            "Default.aspx?id=3620#gsc.tab=0")

    def test_spot_open(self):
        local_tz = pytz.timezone('America/Los_Angeles')
        sc = Spotseeker()
        spot = sc.get_spot_by_id(4)
        spot = organize_hours(spot)

        # monday
        current_time = local_tz.localize(datetime.datetime(
            2015, 12, 14, 7, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))
        current_time = local_tz.localize(datetime.datetime(
            2015, 12, 14, 10, 30, 0, 0))
        self.assertTrue(get_is_spot_open(spot, current_time))
        # tuesday (still open from monday)
        current_time = local_tz.localize(datetime.datetime(
            2015, 12, 15, 1, 0, 0, 0))
        self.assertTrue(get_is_spot_open(spot, current_time))
        # tuesday after monday's opening is closed
        current_time = local_tz.localize(datetime.datetime(
            2015, 12, 15, 3, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))
        # saturday (only open from friday's opening)
        current_time = local_tz.localize(datetime.datetime(
            2015, 12, 19, 10, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))

    def assertOpenPeriods(self, spot, time_tuple, open_periods):
        """
        Assert that the given spot is open during open_periods on the day
        specified by time_tuple, and not open in any others.
        """
        current_time = datetime.datetime(*time_tuple)
        periods = get_open_periods_by_day(spot, current_time)

        exp_open = []
        for period_name in OPEN_PERIODS.keys():
            if period_name in open_periods:
                self.assertTrue(
                    periods[period_name],
                    'Expected spot to be open in period %s on date %s'
                    % (period_name, current_time))
            else:
                self.assertFalse(
                    periods[period_name],
                    'Expected spot to be closed in period %s on date %s'
                    % (period_name, current_time))

    def test_open_periods(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = organize_hours(spot)

        self.assertOpenPeriods(
            spot,
            (2015, 12, 21, 0, 0, 0),
            ('morning', 'afternoon', 'evening'))

        self.assertOpenPeriods(
            spot,
            (2015, 12, 20, 0, 0, 0),
            ())

        self.assertOpenPeriods(
            spot,
            (2015, 12, 24, 0, 0, 0),
            ('morning', 'afternoon'))

        self.assertOpenPeriods(
            spot,
            (2015, 12, 25, 0, 0, 0),
            ('morning', 'afternoon', 'evening', 'late_night'))

        # Test spot open across midnight
        spot = sc.get_spot_by_id(4)
        spot = organize_hours(spot)
        self.assertOpenPeriods(
            spot,
            (2015, 12, 25, 0, 0, 0),
            ('afternoon', 'evening', 'late_night'))

        # Test spots that exactly fill period hours
        spot = sc.get_spot_by_id(5)
        spot = organize_hours(spot)
        # Monday
        self.assertOpenPeriods(spot, (2016, 4, 18, 0, 0, 0), ('late_night',))
        # Tuesday
        self.assertOpenPeriods(spot, (2016, 4, 19, 0, 0, 0), ('morning',))
        # Wednesday
        self.assertOpenPeriods(spot, (2016, 4, 20, 0, 0, 0), ('afternoon',))
        # Thursday
        self.assertOpenPeriods(spot, (2016, 4, 21, 0, 0, 0), ('evening',))
        # Friday
        self.assertOpenPeriods(spot, (2016, 4, 22, 0, 0, 0), ('late_night',))
        # Sunday
        self.assertOpenPeriods(spot, (2016, 4, 24, 0, 0, 0), ())

    def test_get_spot_list(self):
        self.assertEqual(len(get_spot_list(app_type='food')), 3)
        self.assertEqual(len(get_spot_list(app_type='study')), 0)
        self.assertEqual(len(get_spot_list(app_type='tech')), 3)

    def test_get_spots_by_filter_pasta_food_court(self):
        filtered_spots = get_spots_by_filter([
            ('extended_info:s_food_pasta', True),
            ('type', 'food_court'),
            ('extended_info:app_type', 'food')
        ])
        self.assertEqual(len(filtered_spots), 1)

    def test_get_spot_filters(self):
        request = RequestFactory().get(
            '/?payment0=s_pay_dining&type0=food_court&food0=s_food_entrees&'
            'food1=s_food_pasta&cuisine0=s_cuisine_chinese&period0=morning'
            '&open_now=true')
        filters = _get_spot_filters(request)
        self.assertEqual(len(filters), 8)

    def test_organize_hours_premade(self):
        sc = Spotseeker()
        spot = sc.get_spot_by_id(4)
        spot_hours = organize_hours(spot)

        self.assertEqual(len(spot_hours.hours), 7)

    def test_group_by_building(self):
        spots = []
        sc = Spotseeker()
        spots.append(sc.get_spot_by_id(1))
        spots.append(sc.get_spot_by_id(4))
        spots.append(sc.get_spot_by_id(5))

        grouped_spots = group_spots_by_building(spots)

        self.assertEqual(len(grouped_spots), 2)
        self.assertEqual(grouped_spots[1]['name'],
                         "Odegaard Undergraduate Library")
        self.assertEqual(len(grouped_spots[1]['spots']), 2)

    def test_get_avg_latlng(self):
        spots = []
        sc = Spotseeker()
        spots.append(sc.get_spot_by_id(1))
        spots.append(sc.get_spot_by_id(4))
        spots.append(sc.get_spot_by_id(5))
        avg_latlng = get_avg_latlng_for_spots(spots)
        self.assertEqual(avg_latlng, (47.65607183333333, -122.3100596))

    def test_get_building_latlng(self):
        spots = []
        sc = Spotseeker()
        spots.append(sc.get_spot_by_id(1))
        spots.append(sc.get_spot_by_id(4))
        spots.append(sc.get_spot_by_id(5))
        grouped_spots = group_spots_by_building(spots)
        grouped_spots = add_latlng_to_building(grouped_spots)
        self.assertEqual(grouped_spots[1]['latitude'], 47.656462)
        self.assertEqual(grouped_spots[1]['longitude'], -122.3125347)

    def test_period_filter(self):
        period = "morning"
        dt = datetime.datetime(2016, 4, 20, 0, 0, 0)
        period_filter = _get_period_filter(period, dt)

        expected_response = [('fuzzy_hours_start', 'Wednesday,05:01'),
                             ('fuzzy_hours_end', 'Wednesday,10:59')]

        self.assertEqual(period_filter, expected_response)

    def test_time_offset(self):
        time = datetime.time(10, 0, 0)
        # adding
        new_time = adjust_time_by_offset(time, 1)
        self.assertEqual(new_time, datetime.time(10, 1, 0))
        # subtracting
        new_time = adjust_time_by_offset(time, -1)
        self.assertEqual(new_time, datetime.time(9, 59, 0))


class FakeClient(object):
    """
    Fake spot client that will cause data failure exceptions
    """
    def data_failure(*args, **kwargs):
        raise DataFailureException('http://foo/bar', 567, 'Foo Bar')

    get_spot_by_id = data_failure
    search_spots = data_failure


@override_settings(SPOTSEEKER_DAO_CLASS=DAO)
class DAOErrorsTest(TestCase):
    """
    Ensure DataFailureExceptions are handled properly in space DAO
    """
    def setUp(self):
        # Use our fake spot client in space dao instead of the real one
        self.old_client = space.Spotseeker
        new_client = FakeClient
        space.Spotseeker = new_client

    def tearDown(self):
        # Restore original such as to not interfere with other tests
        space.Spotseeker = self.old_client

    def test_get_spot_list_error(self):
        """
        Assert get_spot_list returns an empty list when encountering
        a failure.
        """
        self.assertEqual(get_spot_list(), [])

    def test_get_spots_by_filter_error(self):
        """
        Assert get_spots_by_filter returns an empty list when encountering
        a failure.
        """
        self.assertEqual(get_spots_by_filter(), [])

    def test_get_spot_by_id_error(self):
        """
        Assert get_spot_by_id returns None when encountering a failure.
        """
        self.assertIsNone(get_spot_by_id(4))
