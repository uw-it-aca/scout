SCOUT
=====

This README documents whatever steps are necessary to get your application up and running.

## Vagrant Installation ##

**Clone Scout Vagrant**  
    
    $ git clone https://github.com/uw-it-aca/scout-vagrant
    
**Start the Vagrant box**

    $ cd scout-vagrant
    $ vagrant up
    
**Run your server (from Vagrant):**
    
    $ vagrant ssh 
    $vagrant(venv) python manage.py runserver 0:8000
    
## Classic Installation ##

**Create a virtualenv for your project**
    
    $ virutualenv yourenv
    $ cd yourenv
    $ source bin/activate
    
**Install Scout app**  
    
    $ (yourenv) pip install -e git+https://github.com/uw-it-aca/scout/#egg=scout

**Create an empty Django project**
    
    $ (yourenv) django-admin.py startproject yourproj .
    $ (yourenv) cd yourproj
    
**Update your urls.py**
    
    urlpatterns = patterns('',
        ...
        url(r'^', include('scout.urls')),
    )
    
**Update your settings.py**
    
    INSTALLED_APPS = (
        ...
        'scout',
        'turbolinks',
        'compressor',
    )

    MIDDLEWARE_CLASSES = (
        ...
        'django_mobileesp.middleware.UserAgentDetectionMiddleware',
        'htmlmin.middleware.HtmlMinifyMiddleware',
        'htmlmin.middleware.MarkRequestMiddleware',
    )

    TEMPLATES = [
        {
            ...
            'OPTIONS': {
                'context_processors': [
                    ...
                    'scout.context_processors.less_compiled',
                    'scout.context_processors.google_analytics',
                    'scout.context_processors.devtools_bar',
                ]
            }
        }
    ]

    STATICFILES_FINDERS = (
        "django.contrib.staticfiles.finders.FileSystemFinder",
        "django.contrib.staticfiles.finders.AppDirectoriesFinder",
        'compressor.finders.CompressorFinder',
    )

    COMPRESS_ROOT = "/tmp/some/path/for/files"
    COMPRESS_PRECOMPILERS = (('text/less', 'lessc {infile} {outfile}'),)
    COMPRESS_ENABLED = False # True if you want to compress your development build
    COMPRESS_OFFLINE = False # True if you want to compress your build offline
    COMPRESS_CSS_FILTERS = [
        'compressor.filters.css_default.CssAbsoluteFilter',
        'compressor.filters.cssmin.CSSMinFilter'
    ]
    COMPRESS_JS_FILTERS = [
        'compressor.filters.jsmin.JSMinFilter',
    ]
        
    # mobileesp
    from django_mobileesp.detector import mobileesp_agent as agent
    
    DETECT_USER_AGENTS = {
        'is_android': agent.detectAndroid,
        'is_ios': agent.detectIos,
        'is_windows_phone': agent.detectWindowsPhone,
        'is_tablet' : agent.detectTierTablet,
        'is_mobile': agent.detectMobileQuick,
    }
    
    # htmlmin
    HTML_MINIFY = True

**Create your database**

    $ (yourenv) python manage.py syncdb

**Run your server:**
    
    $ (yourenv) python manage.py runserver 0:8000
        
**It worked!** 
    
    You should see the Django server running when viewing http://localhost:8000

