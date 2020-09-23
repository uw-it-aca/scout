from .base_settings import *
#from google.oauth2 import service_account
import os

#if os.getenv("ENV", "localdev") == "localdev":
#    DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"
#    MEDIA_ROOT = os.getenv("MEDIA_ROOT", "/app/data/")
#else:
#    DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
#    GS_PROJECT_ID = os.getenv("STORAGE_PROJECT_ID", "")
#    GS_BUCKET_NAME = os.getenv("STORAGE_BUCKET_NAME", "")
#    GS_LOCATION = os.path.join(os.getenv("ENV"), "csvfiles")
#    GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
#        "/gcs/credentials.json")

INSTALLED_APPS += [
    "scout",
    #"templatetag_handlebars",
    #"django.contrib.humanize",
    "django_user_agents",
    "compressor",
]

COMPRESS_ROOT = "/static/"

COMPRESS_PRECOMPILERS = (("text/x-scss", "django_pyscss.compressor.DjangoScssFilter",))

COMPRESS_OFFLINE = False

STATICFILES_FINDERS += ("compressor.finders.CompressorFinder",)

TEMPLATES[0]["OPTIONS"]["context_processors"].extend([
    "scout.context_processors.google_maps",
    "scout.context_processors.google_analytics",
    "scout.context_processors.is_desktop",
    "scout.context_processors.is_hybrid",
])

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", " ")

#AUTH_PASSWORD_VALIDATORS = [
#    {
#        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
#    },
#    {
#        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
#    },
#    {
#        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
#    },
#    {
#        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
#    },
#]

#SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "")
#PIVOT_AUTHZ_GROUPS = {
#    "access": os.getenv("PIVOT_ACCESS_GROUP", "u_test_access")
#}

#if os.getenv("AUTH", "NONE") == "SAML_MOCK":
#    MOCK_SAML_ATTRIBUTES["isMemberOf"] = [
#        PIVOT_AUTHZ_GROUPS["access"],
#    ]
#elif os.getenv("AUTH", "NONE") == "SAML_DJANGO_LOGIN":
#    DJANGO_LOGIN_MOCK_SAML["SAML_USERS"][0]["MOCK_ATTRIBUTES"][
#        "isMemberOf"
#    ] = [
#        PIVOT_AUTHZ_GROUPS["access"],
#    ]

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
        "null": {
            "class": "logging.NullHandler",
        },
    },
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse"
        },
        "stdout_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno <= logging.WARNING
        },
        "stderr_stream": {
            "()": "django.utils.log.CallbackFilter",
            "callback": lambda record: record.levelno >= logging.ERROR
        }
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
        "scout": {
            "handlers": ["stdout"],
            "level": "INFO",
            "propagate": True,
        },
    }
}

SCOUT_SHOW_NEWSSPLASH = False
COMPRESS_OFFLINE = False
