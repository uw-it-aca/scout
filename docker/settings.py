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

COMPRESS_ENABLED = True
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
    ]
)

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", " ")

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
        "null": {"class": "logging.NullHandler",},
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
        "scout": {"handlers": ["stdout"], "level": "INFO", "propagate": True,},
    },
}

# scout settings
CAMPUS_URL_LIST = ["seattle", "tacoma", "bothell"]
SCOUT_SHOW_NEWSSPLASH = os.getenv("SCOUT_SHOW_NEWSSPLASH") == "True"
