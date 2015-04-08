# dev settings

# SECRET KEY: generate a secret key to use with the application
# http://www.miniwebtool.com/django-secret-key-generator/

SECRET_KEY = ''

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
INTERNAL_IPS = (
    '127.0.0.1',
    '0.0.0.0', #add your server's ip address!
)
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = []

# STATIC_ROOT is required as of Django 1.6.2
# This should be a real apache served location if you're using Apache.
STATIC_ROOT = '/tmp/'

# django compressor and less-c compiler
COMPRESS_PRECOMPILERS = (('text/less', 'lessc {infile} {outfile}'),)
COMPRESS_ENABLED = True # True if you want to compress your development build
COMPRESS_OFFLINE = False # True if you want to compress your build offline
COMPRESS_OUTPUT_DIR = ''
COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter'
]
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter',
]

# google analytics tracking
#GOOGLE_ANALYTICS_KEY = "UA-XXXXXXXX-X"

# enforce fidelity model
TRESTLE_FIDELITY_LOW_ENABLED = True

# devtools
TRESTLE_DEVTOOLS_ENABLED = True
