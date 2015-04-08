SCOUT
=====

This README documents whatever steps are necessary to get your application up and running.

## Installing the project ##

**Create and activate your virtual environment**
    
    $ virtualenv scoutenv
    $ cd scoutenv
    $ source bin/activate

**Install Node**

    This process varies per platform.

**Install Less**

    $ npm install less

**Clone repository:**
    
    $ (scoutenv) git clone https://github.com/charlon/scout.git

**Install dependencies:**

    $ (scoutenv) cd scout
    $ (scoutenv) pip install -r requirements.txt

**Create local_settings.py**
    
    $ (scoutenv) cp scout/local_example.py scout/local_settings.py

**Update local_settings.py settings**

Generate a secret key for your project using the URL provided

    SECRET_KEY = ''

**Test your server:**
    
    $ (scoutenv) python manage.py runserver 0:8000
    
    
**It worked!** You should see the Django server running when viewing http://localhost:8000

