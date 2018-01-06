[![Build Status](https://travis-ci.org/uw-it-aca/scout.svg?branch=develop)](https://travis-ci.org/uw-it-aca/scout)  [![Coverage Status](https://coveralls.io/repos/uw-it-aca/scout/badge.svg?branch=master&service=github)](https://coveralls.io/github/uw-it-aca/scout?branch=master)

# Scout

This is the Scout app. It connects to services provided by [spotseeker_server](https://github.com/uw-it-aca/spotseeker_server).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Django <1.8.6. (Is this still true?)
* A Python installation (2.6 or 2.7)
* pip or easy_install
* git

### Installing

Use pip to install the app as editable from GitHub:

```
pip install -e git+https://github.com/uw-it-aca/scout.git#egg=scout
```

You'll also need [spotseeker_client](https://github.com/uw-it-aca/spotseeker_client)

```
pip install -e git+https://github.com/uw-it-aca/spotseeker_client.git#egg=spotseeker_restclient
```

In settings.py:

Add scout to your INSTALLED_APPS:

```
INSTALLED_APPS = (
    ...
    'scout',
    'spotseeker_restclient',
    'compressor',
    ...
)
```

Add django_mobileesp to MIDDLEWARE_CLASSES:

```
MIDDLEWARE_CLASSES = (
    ...
    'django_mobileesp.middleware.UserAgentDetectionMiddleware',
    ...
)
```

Add additional context_processors to TEMPLATES-OPTIONS

```
TEMPLATES = [ 
    {   
        ...
        'OPTIONS': {
            'context_processors': [
                ...
                'scout.context_processors.google_maps',
                'scout.context_processors.google_analytics',
                'scout.context_processors.is_desktop',
                'scout.context_processors.is_hybrid',
                ...
            ],  
        }, 
        ... 
    },  
]
```

Add STATICFILES_FINDERS:

```
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)
```

Add STATIC_ROOT:

```
STATIC_ROOT = 'static/'
```

Add import statement and  DETECT_USER_AGENTS:

```
from django_mobileesp.detector import mobileesp_agent as agent

DETECT_USER_AGENTS = {
     'is_tablet' : agent.detectTierTablet,
     'is_mobile': agent.detectMobileQuick,
     'is_and': agent.detectAndroid,
     'is_ios': agent.detectIos,
     'is_win': agent.detectWindowsPhone,
}
```

Add the following compress settings:

```
COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'sass --scss {infile} {outfile}'),
    ('text/x-scss', 'django_pyscss.compressor.DjangoScssFilter')
)

COMPRESS_ENABLED = True
COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter'
]
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter',
]
```

Add details for connection to spotseeker_server. Change 'File' to 'Live' if you want to connect to a live spotseeker_server instead of using the file-based mock data (File-based mocks are sufficient for unit tests, but do not match any of the queries the app will make:

```
SPOTSEEKER_HOST = ''
SPOTSEEKER_OAUTH_KEY = ''
SPOTSEEKER_OAUTH_SECRET = ''
SPOTSEEKER_DAO_CLASS = 'spotseeker_restclient.dao_implementation.spotseeker.File'
```
Additional settings:

```
CAMPUS_URL_LIST = ['seattle', 'tacoma', 'bothell']

COMPRESS_ROOT = '/tmp/'
```

Add the app to your project's urls.py:

```
from django.conf.urls import patterns, include, url 

handler404 = 'scout.views.custom_404_response'

urlpatterns = patterns('',
    ... 
    url(r'^', include('scout.urls')),
    ... 
)
```
For additional settings, see [some page that doesn't exist yet.]

Create your database, and you can run the server.

```
python manage.py syncdb
python manage.py runserver
```

## Running the tests

```
python manage.py test scout
```

## Deployment

(To be completed.)

## Built With

* [Django](http://djangoproject.com/)

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. (This has yet to be writtien.)

## Versioning

For the versions available, see the [tags on this repository](https://github.com/uw-it-aca/scout/tags).

## Authors

* [**Academic Experience Design & Delivery**](https://github.com/uw-it-aca)

See also the list of [contributors](https://github.com/uw-it-aca/scout/contributors) who participated in this project.

## License

Copyright 2012-2016 UW Information Technology, University of Washington

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## List of settings

(To be moved to the wiki eventually.)

CAMPUS_URL_LIST
GOOGLE_ANALYTICS_KEY
GOOGLE_MAPS_API
SPOTSEEKER_DAO_CLASS
SPOTSEEKER_HOST = ''
SPOTSEEKER_OAUTH_KEY = ''
SPOTSEEKER_OAUTH_SECRET = ''
