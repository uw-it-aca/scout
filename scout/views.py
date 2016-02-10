from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response
from scout.space_dao import get_spot_list, get_spot_by_id, get_filtered_spots
from scout.space_dao import get_spots_by_filter, get_period_filter
from django.http import Http404

import urllib
import json

# using drumheller fountain as the default center
DEFAULT_LAT = 47.653717
DEFAULT_LON = -122.307755


def discover_view(request):
    context = {
        "open": get_spots_by_filter([('limit', 5),
                                     ('open_now', True),
                                     ('center_latitude', DEFAULT_LAT),
                                     ('center_longitude', DEFAULT_LON),
                                     ('distance', 1000), ]),
        "coffee": get_spots_by_filter([('extended_info:s_food_espresso', 'true'),
                                       ('limit', 5),
                                       ('center_latitude', DEFAULT_LAT),
                                       ('center_longitude', DEFAULT_LON),
                                       ('distance', 1000), ]),
        "coupon": get_spots_by_filter([('extended_info:s_has_coupon',
                                        'true'),
                                       ('limit', 5),
                                       ('center_latitude', DEFAULT_LAT),
                                       ('center_longitude', DEFAULT_LON),
                                       ('distance', 1000)]),
        "breakfast": get_spots_by_filter([('limit', 5),
                                          ('center_latitude', DEFAULT_LAT),
                                          ('center_longitude', DEFAULT_LON),
                                          ('distance', 1000)] +
                                         get_period_filter('breakfast')),
        "late_night": get_spots_by_filter([('limit', 5),
                                           ('center_latitude', DEFAULT_LAT),
                                           ('center_longitude', DEFAULT_LON),
                                           ('distance', 1000)] +
                                          get_period_filter('late_night'))
    }
    return render_to_response('scout/discover.html',
                              context,
                              context_instance=RequestContext(request))


def discover_card_view(request, discover_category):
    # Will figure this out later
    lat = None
    lon = None

    discover_categories = {
        "open": {
            "title": "Open Now",
            "filter_url": "open_now=true",
            "filter": [
                ('limit', 5),
                ('open_now', True),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000)
            ]
        },
        "coffee": {
            "title": "Serves Coffee And Espresso",
            "filter_url": "food0=s_food_espresso",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('extended_info:s_food_espresso', 'true')
            ]
        },
        "coupon": {
            "title": "Dine with Discounts",
            "filter_url": "",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('extended_info:s_has_coupon', 'true')
            ]
        },
        "breakfast": {
            "title": "Open for Breakfast",
            "filter_url": "period0=breakfast",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000)
                ] + get_period_filter('breakfast')

        },
        "late": {
            "title": "Open Late Night",
            "filter_url": "period0=late_night",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000)
                ] + get_period_filter('late_night')
        },
    }

    try:
        discover_data = discover_categories[discover_category]
    except KeyError:
        raise Http404("Discover card does not exist")

    context = {
        "spots": get_spots_by_filter(discover_data["filter"]),
        "card_title": discover_data["title"],
        "card_filter_url": discover_data["filter_url"]
    }

    return render_to_response('scout/discover_card.html',
                              context,
                              context_instance=RequestContext(request))


def map_view(request):
    if len(request.GET) > 0:
        spots = get_filtered_spots(request)
    else:
        spots = get_spot_list()
    context = {"spots": spots}
    return render_to_response('scout/map.html', context,
                              context_instance=RequestContext(request))


def filter_view(request):
    return render_to_response('scout/filter.html',
                              context_instance=RequestContext(request))


def favorites_view(request):
    return render_to_response('scout/favorites.html',
                              context_instance=RequestContext(request))


def list_view(request):
    if len(request.GET) > 0:
        spots = get_filtered_spots(request)
    else:
        spots = get_spot_list()
    context = {"spots": spots}
    return render_to_response('scout/list.html', context,
                              context_instance=RequestContext(request))


def detail_view(request, spot_id):
    spot = get_spot_by_id(spot_id)
    context = {"spot": spot}
    return render_to_response('scout/detail.html', context,
                              context_instance=RequestContext(request))


def hybrid_comps_view(request):
    return render_to_response('hybridize/components.html',
                              context_instance=RequestContext(request))
