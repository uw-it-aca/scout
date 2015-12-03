from spotseeker_restclient.spotseeker import Spotseeker


def get_open_spots():
    spot_client = Spotseeker()
    res = spot_client.search_spots(meta_type="food", open="true")
    for spot in res:
        spot = process_extended_info(spot)
    return res


def get_spot_by_id(spot_id):
    spot_client = Spotseeker()
    res = spot_client.get_spot_by_id(spot_id)
    return process_extended_info(res)


def process_extended_info(spot):
    spot = add_foodtype_names_to_spot(spot)
    spot = add_cuisine_names(spot)
    return spot


def add_cuisine_names(spot):
    CUISINE_TYPE_PREFIX = "s_cuisine"
    CUISINE_TYPE_MAPPING = {
        "s_cuisine_american" : "American",
        "s_cuisine_bbq" : "BBQ",
        "s_cuisine_chinese" : "Chinese",
        "s_cuisine_hawaiian" : "Hawaiian",
        "s_cuisine_indian" : "Indian",
        "s_cuisine_italian" : "Italian",
        "s_cuisine_japanese" : "Japanese",
        "s_cuisine_korean" : "Korean",
        "s_cuisine_mexican" : "Mexican",
        "s_cuisine_vietnamese" : "Vietnamese",
    }
    cuisine_types = [CUISINE_TYPE_MAPPING[obj.key] for obj in spot.extended_info if CUISINE_TYPE_PREFIX in obj.key and obj.value]
    spot.cuisinetype_names = cuisine_types
    return spot


def add_foodtype_names_to_spot(spot):
    FOOD_TYPE_PREFIX = "s_food_"
    FOOD_TYPE_MAPPING = {
        "s_food_appetizers" : "Appetizers",
        "s_food_burgers" : "Burgers",
        "s_food_entrees" : "Entrees",
        "s_food_espresso" : "Espresso",
        "s_food_pasta" : "Pasta",
        "s_food_pizza" : "Pizza",
        "s_food_salads" : "Salads",
        "s_food_sandwiches" : "Sandwiches",
        "s_food_smoothies" : "Smoothies",
        "s_food_sushi" : "Sushi",
        "s_food_tacos" : "Tacos",
    }
    food_types = [FOOD_TYPE_MAPPING[obj.key] for obj in spot.extended_info if FOOD_TYPE_PREFIX in obj.key and obj.value]

    spot.foodtype_names = food_types
    return spot

