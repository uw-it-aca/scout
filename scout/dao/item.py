from scout.dao.space import get_spots_by_filter, _get_spot_filters, \
    _get_extended_info_by_key
import copy
import urllib2

def get_item_by_id(item_id):
    spot = get_spots_by_filter([
            ('item:id', item_id),
            ('extended_info:app_type', 'tech')
    ])
    filtered_spot = _filter_spot_items(item_id, spot[0])
    return filtered_spot


def _filter_spot_items(item_id, spot):
    for item in spot.items:
        if item.item_id == item_id:
            spot.item = item
    return spot


def add_item_info(spot):
    for item in spot.items:
        item.model = _get_extended_info_by_key("i_model",
                                               item.extended_info)
        item.brand = _get_extended_info_by_key("i_brand",
                                               item.extended_info)
        item.checkout_period = _get_extended_info_by_key(
            "i_checkout_period",
            item.extended_info
        )
        item.has_access_restriction = _get_extended_info_by_key(
            "i_has_access_restriction",
            item.extended_info
        )
        item.access_limit_role = _get_extended_info_by_key(
            "i_access_limit_role",
            item.extended_info
        )
        item.access_role_students = _get_extended_info_by_key(
            "i_access_role_students",
            item.extended_info
        )
        item.reservation_required = _get_extended_info_by_key(
            "i_reservation_required",
            item.extended_info
        )
        item.is_active = _get_extended_info_by_key(
            "i_is_active",
            item.extended_info
        )
        item.quantity = _get_extended_info_by_key(
            "i_quantity",
            item.extended_info
        )
        item.description = _get_extended_info_by_key(
            "i_description",
            item.extended_info
        )
        item.reserve_url = _get_extended_info_by_key(
            "i_reserve_url",
            item.extended_info
        )
        item.manual_url = _get_extended_info_by_key(
            "i_manual_url",
            item.extended_info
        )

        if item.reserve_url:
            item.reserve_url = urllib2.unquote(item.reserve_url)
        if item.manual_url:
            item.manual_url = urllib2.unquote(item.manual_url)

    return spot


def get_filtered_items(spots, request):
    parameter_list = _get_spot_filters(request)
    brand = []
    subcategory = []
    for param in parameter_list:
        if param[0] == "item:extended_info:i_brand":
            brand.append(param[1])
        elif param[0] == "item:subcategory":
            subcategory.append(param[1])

    if len(brand) <= 0 and len(subcategory) <= 0:
        return spots

    newSpots = []

    for spot in spots:
        newSpot = copy.deepcopy(spot)
        newSpot.items = []
        for item in spot.items:
            if item.subcategory in subcategory:
                newSpot.items.append(item)
            else:
                if item.brand in brand:
                    newSpot.items.append(item)
        newSpots.append(newSpot)
    return newSpots


def get_item_count(spots):
    item_count = 0
    for spot in spots:
        item_count += len(spot.items)
    return item_count
