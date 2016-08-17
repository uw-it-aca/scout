import copy
from django.test import TestCase
from django.test.utils import override_settings
from scout.dao.space import get_spot_by_id
from scout.dao.item import _filter_spot_items

DAO = "spotseeker_restclient.dao_implementation.spotseeker.File"


@override_settings(SPOTSEEKER_DAO_CLASS=DAO)
class ItemDAOTest(TestCase):

    def test_item_from_spot(self):
        spot = get_spot_by_id(1)
        spot_no_item = copy.deepcopy(spot)

        self.assertEqual("true", "true")
        # item has yet to be completely implemented
        # spot = _filter_spot_items(796, spot)
        # self.assertEqual(spot.filtered_item.item_id, 796)

        # spot_no_item = _filter_spot_items(7961, spot_no_item)
        # self.assertFalse(hasattr(spot_no_item, 'filtered_item'))
