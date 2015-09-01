from django.conf import settings

def less_compiled(request):
    """ See if django-compressor is being used to precompile less
    """
    key = getattr(settings, "COMPRESS_PRECOMPILERS", None)
    return {'less_compiled': key != ()}

def google_analytics(request):

    ga_key = getattr(settings, 'GOOGLE_ANALYTICS_KEY', False)
    return {
        'GOOGLE_ANALYTICS_KEY': ga_key,
        'google_analytics': ga_key
    }

def is_desktop(request):
    
    desktopapp = not request.is_mobile and not request.is_tablet
    
    return {
        'is_desktop' : desktopapp
    }
    
def is_hybrid(request):
    
    hybridapp = request.GET.get('hybrid')
    
    return {
        'is_hybrid' : hybridapp
    }