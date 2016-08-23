from scout.dao.space import get_spots_by_filter, _get_spot_filters
import copy


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
            spot.filtered_item = item
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
                for item_ei in item.extended_info:
                    if item_ei.key == "i_brand":
                        if item_ei.value in brand:
                            newSpot.items.append(item)
        newSpots.append(newSpot)
    return newSpots


def get_item_count(spots):
    item_count = 0
    for spot in spots:
        item_count += len(spot.items)
    return item_count
