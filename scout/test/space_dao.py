from django.test import TestCase
from django.test.utils import override_settings
import pytz
import datetime
from spotseeker_restclient.spotseeker import Spotseeker
from scout.space_dao import add_foodtype_names_to_spot, add_cuisine_names, \
    add_payment_names, add_additional_info, get_is_spot_open, organize_hours


DAO = "spotseeker_restclient.dao_implementation.spotseeker.File"


@override_settings(RESTCLIENT_SPOTSEEKER_DAO_CLASS=DAO)
class SpaceDAOTest(TestCase):

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
        self.assertEqual(spot.menu_url, "https://www.hfs.washington.edu/uploadedFiles/Dining/Dining_Locations/Bahnwebmenu%202014.pdf")
        self.assertEqual(spot.hours_notes,None)
        self.assertEqual(spot.access_notes, None)
        self.assertEqual(spot.has_coupon, None)
        self.assertEqual(spot.coupon_expiration, None)
        self.assertEqual(spot.coupon_url, None)
        self.assertEqual(spot.phone, "206-685-4950")
        self.assertEqual(spot.website_url, "https://www.hfs.washington.edu/dining/Default.aspx?id=3620#gsc.tab=0")

    def test_spot_open(self):
        local_tz = pytz.timezone('America/Los_Angeles')
        sc = Spotseeker()
        spot = sc.get_spot_by_id(1)
        spot = organize_hours(spot)

        # monday
        current_time = local_tz.localize(datetime.datetime(2015, 12, 14, 7, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))
        current_time = local_tz.localize(datetime.datetime(2015, 12, 14, 10, 30, 0, 0))
        self.assertTrue(get_is_spot_open(spot, current_time))
        current_time = local_tz.localize(datetime.datetime(2015, 12, 14, 22, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))

        # sunday
        current_time = local_tz.localize(datetime.datetime(2015, 12, 20, 11, 0, 0, 0))
        self.assertFalse(get_is_spot_open(spot, current_time))