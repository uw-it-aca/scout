from scout.dao.space import get_spots_by_filter


def get_item_by_id(item_id):
    spot = get_spots_by_filter([('item:id', item_id)])
    filtered_spot = _filter_spot_items(item_id, spot[0])
    return filtered_spot


def _filter_spot_items(item_id, spot):
    for item in spot.items:
        if item.item_id == item_id:
            spot.filtered_item = item
    return spot
