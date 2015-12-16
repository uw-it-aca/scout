from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response
from scout.space_dao import get_open_spots, get_spot_by_id, get_filtered_spots

import urllib
import json


def discover_view(request):
    return render_to_response('scout/discover.html',
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
