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

def devtools_bar(request):
    
    devtools = getattr(settings, 'TRESTLE_DEVTOOLS_ENABLED', False)
    return {
        'devtools_bar': devtools
    }

def low_fidelity(request):
    
    lofi = getattr(settings, 'TRESTLE_FIDELITY_LOW_ENABLED', True)
    return {
        'low_fidelity': lofi
    }
