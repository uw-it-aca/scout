from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response
from scout.space_dao import get_open_spots, get_spot_by_id, get_filtered_spots
from scout.space_dao import get_spots_by_filter

import urllib
import json

#using drumheller fountain as the default center
DEFAULT_LAT = 47.653717
DEFAULT_LON = -122.307755


def discover_view(request):
    context = {
        "open": get_spots_by_filter([('limit', 5),
                                     ('open', True),
                                     ('center_latitude', DEFAULT_LAT),
                                     ('center_longitude', DEFAULT_LON),
                                     ('distance', 1000),]),
        "coffee": get_spots_by_filter([('extended_info:s_food_espresso', 'true'),
                                       ('limit', 5),
                                       ('open', True),
                                       ('center_latitude', DEFAULT_LAT),
                                       ('center_longitude', DEFAULT_LON),
                                       ('distance', 1000),]),
        "coupon": get_spots_by_filter([('extended_info:s_has_coupon',
                                        'true'),
                                       ('limit', 5),
                                       ('center_latitude', DEFAULT_LAT),
                                       ('center_longitude', DEFAULT_LON),
                                       ('distance', 1000),])
    }
    return render_to_response('scout/discover.html',
                              context,
                              context_instance=RequestContext(request))


def map_view(request):
    if len(request.GET) > 0:
        spots = get_filtered_spots(request)
    else:
        spots = get_open_spots()
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
        spots = get_open_spots()
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
