from django.http import Http404, HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.exceptions import ImproperlyConfigured
from django.conf import settings
from scout.dao.space import get_spot_list, get_spot_by_id, get_filtered_spots,\
    get_period_filter, get_spots_by_filter, group_spots_by_building,\
    get_building_list, validate_detail_info
from scout.dao.image import get_image
from scout.dao.item import get_item_by_id, get_filtered_items, \
    get_item_count, add_item_info


# using red square as the default center
DEFAULT_LAT = 47.6558539
DEFAULT_LON = -122.3094925


def validate_campus_selection(function):
    def wrap(request, *args, **kwargs):
        if settings.CAMPUS_URL_LIST and isinstance(settings.CAMPUS_URL_LIST,
                                                   list):
            campuses = settings.CAMPUS_URL_LIST
        else:
            raise ImproperlyConfigured("Must define a CAMPUS_URL_LIST"
                                       "of type list in the settings")
        if kwargs['campus'] in campuses:
            return function(request, *args, **kwargs)
        else:
            return custom_404_response(request)
    return wrap


@validate_campus_selection
def discover_view(request, campus):
    context = {"campus": campus}
    return render_to_response('scout/discover.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def discover_card_view(request, campus, discover_category):
    # Will figure this out later
    lat = request.GET.get('latitude', None)
    lon = request.GET.get('longitude', None)

    # Hardcoded for food at the moment. Change it per need basis.
    discover_categories = {
        "open": {
            "title": "Open Now",
            "spot_type": "food",
            "filter_url": "open_now=true",
            "filter": [
                ('limit', 5),
                ('open_now', True),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('extended_info:app_type', 'food')
                ]
        },
        "morning": {
            "title": "Open Mornings (5am - 11am)",
            "spot_type": "food",
            "filter_url": "period0=morning",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('extended_info:app_type', 'food')
                ] + get_period_filter('morning')

        },
        "late": {
            "title": "Open Late Night (10pm - 5am)",
            "spot_type": "food",
            "filter_url": "period0=late_night",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('extended_info:app_type', 'food')
                ] + get_period_filter('late_night')
        },
        "studyoutdoors": {
            "title": "Outdoor Study Areas",
            "spot_type": "study",
            "filter_url": "type0=outdoor",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('type', 'outdoor')
                ]
        },
        "studycomputerlab": {
            "title": "Computer Labs",
            "spot_type": "study",
            "filter_url": "type0=computer_lab",
            "filter": [
                ('limit', 5),
                ('center_latitude', lat if lat else DEFAULT_LAT),
                ('center_longitude', lon if lon else DEFAULT_LON),
                ('distance', 100000),
                ('type', 'computer_lab')
            ]

        },
    }

    try:
        discover_data = discover_categories[discover_category]
    except KeyError:
        return custom_404_response(request)

    discover_data["filter"].append(('extended_info:campus', campus))

    spots = get_spots_by_filter(discover_data["filter"])
    if len(spots) == 0:
        return custom_404_response(request)
    context = {
        "spots": spots,
        "campus": campus,
        "card_title": discover_data["title"],
        "spot_type": discover_data["spot_type"],
        "card_filter_url": discover_data["filter_url"]
    }

    return render_to_response('scout/discover_card.html',
                              context,
                              context_instance=RequestContext(request))


# food
@validate_campus_selection
def food_list_view(request, campus):
    spots = get_filtered_spots(request, campus, "food")
    context = {"spots": spots,
               "campus": campus,
               "count": len(spots),
               "app_type": 'food'}
    return render_to_response('scout/food/list.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def food_detail_view(request, campus, spot_id):
    spot = get_spot_by_id(spot_id)
    spot = validate_detail_info(spot, campus, "food")
    if not spot:
        return custom_404_response(request, campus)

    context = {"spot": spot,
               "campus": campus,
               "app_type": 'food'}
    return render_to_response('scout/food/detail.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def food_filter_view(request, campus):
    context = {"campus": campus,
               "app_type": 'food'}
    return render_to_response('scout/food/filter.html', context,
                              context_instance=RequestContext(request))


# study
@validate_campus_selection
def study_list_view(request, campus):
    spots = get_filtered_spots(request, campus, "study")
    grouped_spots = group_spots_by_building(spots)
    context = {"spots": spots,
               "campus": campus,
               "grouped_spots": grouped_spots,
               "count": len(spots),
               "app_type": 'study'}
    return render_to_response('scout/study/list.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def study_detail_view(request, campus, spot_id):
    spot = get_spot_by_id(spot_id)
    spot = validate_detail_info(spot, campus, "study")
    if not spot:
        return custom_404_response(request, campus)

    context = {"spot": spot,
               "campus": campus,
               "app_type": 'study'}
    return render_to_response('scout/study/detail.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def study_filter_view(request, campus):
    context = {"campus": campus,
               "buildings": get_building_list(campus),
               "app_type": 'study'}
    return render_to_response('scout/study/filter.html', context,
                              context_instance=RequestContext(request))


# tech
@validate_campus_selection
def tech_list_view(request, campus):
    # spots = get_spots_by_filter([('has_items', 'true')])
    spots = get_filtered_spots(request, campus, "tech")
    spots = get_filtered_items(spots, request)
    count = get_item_count(spots)
    if count <= 0:
        spots = []

    context = {"spots": spots,
               "campus": campus,
               "count": count,
               "app_type": 'tech'}
    return render_to_response('scout/tech/list.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def tech_detail_view(request, campus, item_id):
    spot = get_item_by_id(int(item_id))
    spot = validate_detail_info(spot, campus, "tech")
    if not spot:
        return custom_404_response(request, campus)

    context = {"spot": spot,
               "campus": campus,
               "app_type": 'tech'}
    return render_to_response('scout/tech/detail.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def tech_filter_view(request, campus):
    context = {"campus": campus,
               "app_type": 'tech'}
    return render_to_response('scout/tech/filter.html', context,
                              context_instance=RequestContext(request))


# hybrid
@validate_campus_selection
def hybrid_discover_view(request, campus):
    context = {"campus": campus}
    return render_to_response('hybridize/discover.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_food_list_view(request, campus):
    spots = get_filtered_spots(request, campus, "food")
    context = {"spots": spots,
               "campus": campus}
    return render_to_response('hybridize/food/list.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_food_detail_view(request, campus, spot_id):
    spot = get_spot_by_id(spot_id)
    context = {"spot": spot,
               "campus": campus}
    return render_to_response('hybridize/food/detail.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_food_filter_view(request, campus):
    context = {"campus": campus}
    return render_to_response('hybridize/food/filter.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_study_list_view(request, campus):
    spots = get_filtered_spots(request, campus, "study")
    grouped_spots = group_spots_by_building(spots)
    context = {"spots": spots,
               "campus": campus,
               "grouped_spots": grouped_spots,
               "count": len(spots),
               "app_type": 'study'}
    return render_to_response('hybridize/study/list.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_study_detail_view(request, campus, spot_id):
    spot = get_spot_by_id(spot_id)
    if not spot:
        return custom_404_response(request, campus)

    context = {"spot": spot,
               "campus": campus,
               "app_type": 'study'}
    return render_to_response('hybridize/study/detail.html', context,
                              context_instance=RequestContext(request))


@validate_campus_selection
def hybrid_tech_list_view(request, campus):
    spots = get_spots_by_filter([('has_items', 'true')])
    context = {"spots": spots,
               "campus": campus,
               "count": len(spots),
               "app_type": 'tech'}
    return render_to_response('hybridize/tech/list.html', context,
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
        return custom_404_response(request)


# Custom 404 page
def custom_404_response(request, campus="seattle"):
    context = {"campus": campus}
    response = render_to_response('404.html', context,
                                  context_instance=RequestContext(request))
    response.status_code = 404
    return response
