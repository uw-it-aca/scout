from django.conf import settings


def google_maps(request):
    """ See if there is a Google Analytics web property id
    """
    gmaps_api_key = getattr(settings, 'GOOGLE_MAPS_API', False)
    return {
        'GOOGLE_MAPS_API': gmaps_api_key,
        'google_maps': gmaps_api_key
    }


def google_analytics(request):

    ga_key = getattr(settings, 'GOOGLE_ANALYTICS_KEY', False)
    return {
        'GOOGLE_ANALYTICS_KEY': ga_key,
        'google_analytics': ga_key
    }


def is_desktop(request):

    desktopapp = not request.is_mobile and not request.is_tablet

    return {
        'is_desktop': desktopapp
    }


def is_hybrid(request):

    hybridapp = request.GET.get('hybrid')

    return {
        'is_hybrid': hybridapp
    }
