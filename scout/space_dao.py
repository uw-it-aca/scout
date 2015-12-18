from spotseeker_restclient.spotseeker import Spotseeker


def get_open_spots():
    spot_client = Spotseeker()
    res = spot_client.search_spots([('open', True),
                                    ('limit', 200),
                                    ('extended_info:app_type', 'food')])
    for spot in res:
        spot = process_extended_info(spot)
    return res


def get_spots_by_filter(filters):
    filters.append(('extended_info:app_type', 'food'))
    spot_client = Spotseeker()
    res = spot_client.search_spots(filters)
    for spot in res:
        spot = process_extended_info(spot)
    return res


def get_filtered_spots(request):
    filters = _get_spot_filters(request)
    # adding 'default' filter params
    filters.append(('limit', 200))
    filters.append(('extended_info:app_type', 'food'))

    spot_client = Spotseeker()
    res = spot_client.search_spots(filters)

    for spot in res:
        spot = process_extended_info(spot)
    return res


def _get_spot_filters(request):
    params = []
    for param in request.GET:
        if "campus" in param:
            params.append(("extended_info:campus", request.GET[param]))
        if "type" in param:
            params.append(("type", request.GET[param]))
        if "food" in param:
            params.append(("extended_info:" + request.GET[param], "true"))
        if "cuisine" in param:
            params.append(("extended_info:" + request.GET[param], "true"))
        if "payment" in param:
            params.append(("extended_info:" + request.GET[param], "true"))
    return params


def get_spot_by_id(spot_id):
    spot_client = Spotseeker()
    res = spot_client.get_spot_by_id(spot_id)
    return process_extended_info(res)


def process_extended_info(spot):
    spot = add_foodtype_names_to_spot(spot)
    spot = add_cuisine_names(spot)
    spot = add_payment_names(spot)
    spot = add_open_periods(spot)
    spot = add_additional_info(spot)
    spot = organize_hours(spot)
    return spot


def organize_hours(spot):
    hours_object = {
        'monday': [],
        'tuesday': [],
        'wednesday': [],
        'thursday': [],
        'friday': [],
        'saturday': [],
        'sunday': [],
    }
    for hours in spot.spot_availability:
        hours_object[hours.day].append([hours.start_time, hours.end_time])
    spot.hours = hours_object
    return spot


def add_additional_info(spot):
    spot.has_alert = _get_extended_info_by_key("s_has_alert",
                                               spot.extended_info)
    spot.alert_notes = _get_extended_info_by_key("s_alert_notes",
                                                 spot.extended_info)
    spot.has_reservation = _get_extended_info_by_key("s_has_reservation",
                                                     spot.extended_info)
    spot.reservation_notes = _get_extended_info_by_key("s_reservation_notes",
                                                       spot.extended_info)
    spot.menu_url = _get_extended_info_by_key("s_menu_url",
                                              spot.extended_info)
    spot.hours_notes = _get_extended_info_by_key("hours_notes",
                                                 spot.extended_info)
    spot.access_notes = _get_extended_info_by_key("s_access_notes",
                                                  spot.extended_info)
    spot.has_coupon = _get_extended_info_by_key("s_has_coupon",
                                                spot.extended_info)
    spot.coupon_expiration = _get_extended_info_by_key("s_coupon_expiration",
                                                       spot.extended_info)
    spot.coupon_url = _get_extended_info_by_key("s_coupon_url",
                                                spot.extended_info)
    spot.phone = _get_extended_info_by_key("s_phone",
                                           spot.extended_info)
    spot.website_url = _get_extended_info_by_key("s_website_url",
                                                 spot.extended_info)
    return spot


def _get_extended_info_by_key(key, extended_info):
    for info in extended_info:
        if info.key == key:
            return info.value


def _get_names_for_extended_info(prefix, mapping, info):
    names = []
    for obj in info:
        if prefix in obj.key and obj.value:
            try:
                names.append(mapping[obj.key])
            except KeyError:
                pass
    return names


def add_open_periods(spot):
    OPEN_PREFIX = "s_open"
    OPEN_MAPPING = {
        "s_open_breakfast": "Breakfast",
        "s_open_lunch": "Lunch",
        "s_open_dinner": "Dinner",
        "s_open_late_night": "Late Night"
    }
    spot.open_periods = _get_names_for_extended_info(OPEN_PREFIX,
                                                     OPEN_MAPPING,
                                                     spot.extended_info)
    return spot


def add_payment_names(spot):
    PAYMENT_PREFIX = "s_pay"
    PAYMENT_MAPPING = {
        "s_pay_cash": "Cash",
        "s_pay_visa": "Visa",
        "s_pay_mastercard": "Mastercard",
        "s_pay_husky": "Husky Card",
        "s_pay_dining": "Dining Account",
    }
    spot.payment_names = _get_names_for_extended_info(PAYMENT_PREFIX,
                                                      PAYMENT_MAPPING,
                                                      spot.extended_info)
    return spot


def add_cuisine_names(spot):
    CUISINE_TYPE_PREFIX = "s_cuisine"
    CUISINE_TYPE_MAPPING = {
        "s_cuisine_american": "American",
        "s_cuisine_bbq": "BBQ",
        "s_cuisine_chinese": "Chinese",
        "s_cuisine_hawaiian": "Hawaiian",
        "s_cuisine_indian": "Indian",
        "s_cuisine_italian": "Italian",
        "s_cuisine_japanese": "Japanese",
        "s_cuisine_korean": "Korean",
        "s_cuisine_mexican": "Mexican",
        "s_cuisine_vietnamese": "Vietnamese",
    }
    spot.cuisinetype_names = _get_names_for_extended_info(CUISINE_TYPE_PREFIX,
                                                          CUISINE_TYPE_MAPPING,
                                                          spot.extended_info)
    return spot


def add_foodtype_names_to_spot(spot):
    FOOD_TYPE_PREFIX = "s_food_"
    FOOD_TYPE_MAPPING = {
        "s_food_appetizers": "Appetizers",
        "s_food_burgers": "Burgers",
        "s_food_entrees": "Entrees",
        "s_food_espresso": "Espresso",
        "s_food_pasta": "Pasta",
        "s_food_pizza": "Pizza",
        "s_food_salads": "Salads",
        "s_food_sandwiches": "Sandwiches",
        "s_food_smoothies": "Smoothies",
        "s_food_sushi": "Sushi",
        "s_food_tacos": "Tacos",
    }
    spot.foodtype_names = _get_names_for_extended_info(FOOD_TYPE_PREFIX,
                                                       FOOD_TYPE_MAPPING,
                                                       spot.extended_info)
    return spot
