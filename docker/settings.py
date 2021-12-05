from .base_settings import *
import os

INSTALLED_APPS += [
    "scout",
    "django_user_agents",
    "compressor",
    "hybridize",
]

MIDDLEWARE += ["django_user_agents.middleware.UserAgentMiddleware"]

COMPRESS_ROOT = "/static/"

COMPRESS_PRECOMPILERS = (
    ("text/x-scss", "django_pyscss.compressor.DjangoScssFilter",),
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
    ]
)

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", " ")
GOOGLE_MAPS_API = os.getenv("GOOGLE_MAPS_API", "")

if os.getenv("ENV", "") == "localdev":
    DEBUG = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "[%(asctime)s] [%(levelname)s] [%(module)s] %(message)s",
            "datefmt": "[%Y-%m-%d %H:%M:%S]",
        },
    },
    "handlers": {
        "stdout": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "filters": ["stdout_stream"],
            "formatter": "standard",
        },
        "stderr": {
            "class": "logging.StreamHandler",
            "stream": sys.stderr,
            "filters": ["stderr_stream"],
            "formatter": "standard",
        },
        "null": {"class": "logging.NullHandler", },
    },
    "filters": {
        "require_debug_false": {"()": "django.utils.log.RequireDebugFalse"},
        "stdout_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno <= logging.WARNING,
        },
        "stderr_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno >= logging.ERROR,
        },
    },
    "loggers": {
        "django.security.DisallowedHost": {
            "handlers": ["null"],
            "propagate": False,
        },
        "django.request": {
            "handlers": ["stderr"],
            "level": "WARNING",
            "propagate": True,
        },
        "scout": {"handlers": ["stdout"], "level": "INFO", "propagate": True, },
    },
}

# scout settings
CAMPUS_URL_LIST = ["seattle", "tacoma", "bothell"]
SCOUT_SHOW_NEWSSPLASH = os.getenv("SCOUT_SHOW_NEWSSPLASH") == "True"
RESTCLIENTS_SPOTSEEKER_HOST = os.getenv("RESTCLIENTS_SPOTSEEKER_HOST", "")
SPOTSEEKER_OAUTH_KEY = os.getenv("SPOTSEEKER_OAUTH_KEY", "")
SPOTSEEKER_OAUTH_SECRET = os.getenv("SPOTSEEKER_OAUTH_SECRET", "")
RESTCLIENTS_SPOTSEEKER_DAO_CLASS = os.getenv("RESTCLIENTS_SPOTSEEKER_DAO_CLASS", "Mock")
OAUTH_USER = os.getenv("OAUTH_USER", "javerage")
SCOUT_SHOW_ALT_TECH = os.getenv("SCOUT_SHOW_ALT_TECH") == "True"
