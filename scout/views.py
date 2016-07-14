from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from scout.dao.space import get_spot_list, get_spot_by_id, get_filtered_spots
from scout.dao.space import get_spots_by_filter, get_period_filter
from scout.dao.image import get_image


# using red square as the default center
DEFAULT_LAT = 47.6558539
DEFAULT_LON = -122.3094925


def discover_view(request):
    return render_to_response('scout/discover.html',
                              context_instance=RequestContext(request))


def discover_card_view(request, discover_category):
    # Will figure this out later
    lat = request.GET.get('latitude', None)
    lon = request.GET.get('longitude', None)

    discover_categories = {
        "open": {
            "title": "Open Near",
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
            "title": "Open during Breakfast (5am - 11am)",
            "filter_url": "period0=breakfast",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000)
                ] + get_period_filter('breakfast')

        },
        "late": {
            "title": "Open Late Night (10pm - 5am)",
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

    spots = get_spots_by_filter(discover_data["filter"])
    if len(spots) == 0:
        raise Http404("No spots for card")
    context = {
        "spots": spots,
        "card_title": discover_data["title"],
        "card_filter_url": discover_data["filter_url"]
    }

    return render_to_response('scout/discover_card.html',
                              context,
                              context_instance=RequestContext(request))


# food
def food_list_view(request):
    if len(request.GET) > 0:
        spots = get_filtered_spots(request)
    else:
        spots = get_spot_list('food')
    context = {"spots": spots,
               "count": len(spots),
               "app_type": 'food'}
    return render_to_response('scout/food/list.html', context,
                              context_instance=RequestContext(request))


def food_detail_view(request, spot_id):
    spot = get_spot_by_id(spot_id)
    if not spot:
        raise Http404("Spot does not exist")

    context = {"spot": spot}
    return render_to_response('scout/food/detail.html', context,
                              context_instance=RequestContext(request))


def food_filter_view(request):
    return render_to_response('scout/food/filter.html',
                              context_instance=RequestContext(request))


# study
def study_list_view(request):
    # if len(request.GET) > 0:
        # TODO: not yet working, get study spots by filter
        # spots = get_filtered_spots(request)
    # else:
    spots = get_spot_list()
    context = {"spots": spots,
               "count": len(spots)}
    return render_to_response('scout/study/list.html', context,
                              context_instance=RequestContext(request))


def study_detail_view(request, spot_id):
    spot = get_spot_by_id(spot_id)
    if not spot:
        raise Http404("Spot does not exist")

    context = {"spot": spot}
    return render_to_response('scout/study/detail.html', context,
                              context_instance=RequestContext(request))


def study_filter_view(request):
    return render_to_response('scout/study/filter.html',
                              context_instance=RequestContext(request))


# tech
def tech_list_view(request):
    spots = get_spot_list('tech')
    context = {"spots": spots,
               "count": len(spots),
               "app_type": 'tech'}
    return render_to_response('scout/tech/list.html', context,
                              context_instance=RequestContext(request))


# hybrid
def hybrid_discover_view(request):
    return render_to_response('hybridize/discover.html',
                              context_instance=RequestContext(request))


def hybrid_food_list_view(request):
    if len(request.GET) > 0:
        spots = get_filtered_spots(request)
    else:
        spots = get_spot_list()
    context = {"spots": spots}
    return render_to_response('hybridize/food/list.html', context,
                              context_instance=RequestContext(request))


def hybrid_food_detail_view(request, spot_id):
    spot = get_spot_by_id(spot_id)
    context = {"spot": spot}
    return render_to_response('hybridize/food/detail.html', context,
                              context_instance=RequestContext(request))


def hybrid_food_filter_view(request):
    return render_to_response('hybridize/food/filter.html',
                              context_instance=RequestContext(request))


def hybrid_comps_view(request):
    return render_to_response('hybridize/components.html',
                              context_instance=RequestContext(request))


# generic views
def image_view(request, image_id, spot_id):
    width = request.GET.get('width', None)
    try:
        resp, content = get_image(spot_id, image_id, width)
        etag = resp.get('etag', None)
        response = HttpResponse(content, content_type=resp['content-type'])
        response['etag'] = etag
        return response
    except Exception:
        raise Http404()
