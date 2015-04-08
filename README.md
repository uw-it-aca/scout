PROJECTNAME
===========

This README documents whatever steps are necessary to get your application up and running.

## Install ##

**Create and activate your virtual environment**
    
    $ virtualenv [projectenv]
    $ cd [projectenv]
    $ source bin/activate

**Install Node**

    This process varies per platform.

**Install Less**

    $ npm install less

**Clone repository:**
    
    $ (projectenv) git clone [repository_location]/projectname.git

**Install dependencies:**

    $ (projectenv) cd [projectname]
    $ (projectenv) pip install -r requirements.txt

**Create local_settings.py**
    
    $ (projectenv) cp projectname/local_example.py projectname/local_settings.py

**Update local_settings.py settings**

Generate a secret key for your project using the URL provided

    SECRET_KEY = ''

**Test your server:**
    
    $ (projectenv) python manage.py runserver 0.0.0.0:8000
    
    
**It worked!** You should see the Django server running when viewing http://localhost:8000


## Working ##

**Activate your virtualenv:**
    
    $ cd projectenv
    $ source bin/activate
    
**Run server:**
    
    $ cd projectname
    $ (projectenv) python manage.py runserver 0.0.0.0:8000
