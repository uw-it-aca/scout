from .base_settings import *
import os

INSTALLED_APPS += [
    "scout",
    "django_user_agents",
    "compressor",
    "hybridize",
]

APP_NAME = os.getenv("APP_NAME", "scout")

MIDDLEWARE += ["django_user_agents.middleware.UserAgentMiddleware"]

COMPRESS_ROOT = "/static/"

COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'django_libsass.SassCompiler'),
)

COMPRESS_ENABLED = os.getenv("COMPRESS_ENABLED", "True") == "True"
COMPRESS_OFFLINE = False

COMPRESS_CSS_FILTERS = [
    "compressor.filters.css_default.CssAbsoluteFilter",
    "compressor.filters.cssmin.CSSMinFilter",
]
COMPRESS_JS_FILTERS = [
    "compressor.filters.jsmin.JSMinFilter",
]

STATICFILES_FINDERS += ("compressor.finders.CompressorFinder",)

TEMPLATES[0]["OPTIONS"]["context_processors"].extend(
    [
        "scout.context_processors.google_maps",
        "scout.context_processors.google_analytics",
        "scout.context_processors.is_desktop",
        "scout.context_processors.is_hybrid",
        "scout.context_processors.scout_show_alt_tech",
        "scout.context_processors.compress_enabled",
        "scout.context_processors.campus_detect_url",
    ]
)

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", " ")
GOOGLE_MAPS_API = os.getenv("GOOGLE_MAPS_API", "")

if os.getenv("ENV", "") == "localdev":
    DEBUG = True

# scout settings
CAMPUS_URL_LIST = ["seattle", "tacoma", "bothell"]
SCOUT_SHOW_NEWSSPLASH = os.getenv("SCOUT_SHOW_NEWSSPLASH") == "True"
RESTCLIENTS_SPOTSEEKER_HOST = os.getenv("RESTCLIENTS_SPOTSEEKER_HOST", "")
SPOTSEEKER_OAUTH_CREDENTIAL = os.getenv("SPOTSEEKER_OAUTH_CREDENTIAL", "")
SPOTSEEKER_OAUTH_SCOPE = os.getenv("SCOPE", "read")
RESTCLIENTS_SPOTSEEKER_DAO_CLASS = os.getenv(
    "RESTCLIENTS_SPOTSEEKER_DAO_CLASS", "Mock"
)
OAUTH_USER = os.getenv("OAUTH_USER", "javerage")
SCOUT_SHOW_ALT_TECH = os.getenv("SCOUT_SHOW_ALT_TECH") == "True"

DEBUG_CACHING = os.getenv("DEBUG_CACHING", "True") == "True"

if DEBUG and not DEBUG_CACHING:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'scout',
        }
    }
