# Copyright 2025 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from scout.dao.space import (
    get_spots_by_filter,
    _get_spot_filters,
    _get_extended_info_by_key,
)
import copy


def get_item_by_id(item_id):
    spot = get_spots_by_filter(
        [("item:id", item_id), ("extended_info:app_type", "tech")]
    )
    if spot:
        spot = _filter_spot_items(item_id, spot[0])
    return spot


def _filter_spot_items(item_id, spot):
    for item in spot.items:
        if item.item_id == item_id:
            spot.item = item
    return spot


def add_item_info(spot):
    for item in spot.items:
        item.model = _get_extended_info_by_key("i_model", item.extended_info)
        item.brand = _get_extended_info_by_key("i_brand", item.extended_info)
        item.checkout_period = _get_extended_info_by_key(
            "i_checkout_period", item.extended_info
        )
        item.reservation_notes = _get_extended_info_by_key(
            "i_reservation_notes", item.extended_info
        )
        item.is_active = _get_extended_info_by_key(
            "i_is_active", item.extended_info
        )
        item.quantity = _get_extended_info_by_key(
            "i_quantity", item.extended_info
        )
        item.description = _get_extended_info_by_key(
            "i_description", item.extended_info
        )
        item.reserve_url = _get_extended_info_by_key(
            "i_reserve_url", item.extended_info
        )
        item.manual_url = _get_extended_info_by_key(
            "i_manual_url", item.extended_info
        )
        item.owner = _get_extended_info_by_key("i_owner", item.extended_info)
        item.is_stf = _get_extended_info_by_key("i_is_stf", item.extended_info)
        item.cte_type_id = _get_extended_info_by_key(
            "cte_type_id", item.extended_info
        )

    return spot


def get_filtered_items(spots, request):
    parameter_list = _get_spot_filters(request)
    brand = []
    subcategory = []
    is_active = False
    for param in parameter_list:
        if param[0] == "item:extended_info:i_brand":
            brand.append(param[1])
        elif param[0] == "item:subcategory":
            subcategory.append(param[1])
        elif param[0] == "item:extended_info:i_is_active":
            is_active = True

    new_spots = []

    for spot in spots:
        new_spot = copy.deepcopy(spot)
        new_spot.items = []
        for item in spot.items:
            if is_active and not item.is_active:
                continue
            if len(subcategory) > 0 and item.subcategory not in subcategory:
                continue
            if len(brand) > 0 and item.brand not in brand:
                continue
            new_spot.items.append(item)
        new_spots.append(new_spot)
    return new_spots


def get_item_count(spots):
    item_count = 0
    for spot in spots:
        item_count += len(spot.items)
    return item_count
