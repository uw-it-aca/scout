import copy
from django.test import TestCase
from django.test.client import RequestFactory
from django.test.utils import override_settings
from scout.dao.space import get_spot_by_id, get_spots_by_filter
from scout.dao.item import _filter_spot_items, get_filtered_items, \
    get_item_count

DAO = "spotseeker_restclient.dao_implementation.spotseeker.File"


@override_settings(SPOTSEEKER_DAO_CLASS=DAO)
class ItemDAOTest(TestCase):
    """
    Runs tests on the item DAO to check for intended behavior.
    """
    def test_item_from_spot(self):
        spot = get_spot_by_id(1)
        spot_no_item = copy.deepcopy(spot)

        spot = _filter_spot_items(796, spot)
        self.assertEqual(spot.item.item_id, 796)

        spot_empty_item = _filter_spot_items(7961, spot_no_item)
        self.assertFalse(hasattr(spot_no_item, 'item'))

    def test_item_filter(self):
        """
        Test the result when a few filters are applied to the results.
        """
        query_tuple = [
            ('limit', 0),
            ('item:extended_info:i_brand', 'Apple'),
            ('extended_info:app_type', 'tech')
        ]
        request = RequestFactory().get(
            '/?limit=0&item:extended_info:i_brand=Apple&'
            'extended_info:app_type=tech'
        )

        spots = get_spots_by_filter(query_tuple)
        filtered_spots = get_filtered_items(spots, request)
        self.assertNotEqual(
            get_item_count(spots),
            get_item_count(filtered_spots),
            "Filters weren't applied. All items were returned!"
        )
        self.assertEqual(
            get_item_count(filtered_spots),
            15,
            "Invalid number of filtered items returned"
        )
        for spot in filtered_spots:
            for item in spot.items:
                self.assertEqual(
                    item.brand,
                    "Apple",
                    "Invalid brand for spot %s item %s made through the "
                    "filters." % (spot.name, item.name)
                )

    def test_item_nofilter(self):
        """
        Test the result when no filters are applied to the results.
        """
        query_tuple = [
            ('limit', 0),
            ('extended_info:app_type', 'tech')
        ]
        request = RequestFactory().get(
            '/?limit=0&extended_info:app_type=tech'
        )

        spots = get_spots_by_filter(query_tuple)
        filtered_spots = get_filtered_items(spots, request)
        self.assertEqual(
            get_item_count(spots),
            get_item_count(filtered_spots),
            "Filters weren't applied. All items weren't returned!"
        )
        self.assertEqual(
            get_item_count(filtered_spots),
            115,
            "Invalid number of filtered items returned"
        )

    def test_item_invalid_filter(self):
        """
        Test the result when invalid filters are applied to the results.
        """
        query_tuple = [
            ('limit', 0),
            ('extended_info:app_type', 'invalid')
        ]
        request = RequestFactory().get(
            '/?limit=0&extended_info:app_type=invalid'
        )

        spots = get_spots_by_filter(query_tuple)
        filtered_spots = get_filtered_items(spots, request)
        self.assertEqual(
            spots,
            filtered_spots,
            "Filters weren't applied. All items weren't returned!"
        )
        self.assertEqual(
            get_item_count(filtered_spots),
            0,
            "Invalid number of filtered items returned"
        )
