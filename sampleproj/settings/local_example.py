import os
from sampleproj.settings.base import *

DEBUG = True
ALLOWED_HOSTS = []

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'CHANGE_ME_IN_IM_SECRET'

# spotseeker-test api stuff
SPOTSEEKER_HOST = ''
SPOTSEEKER_OAUTH_KEY = ''
SPOTSEEKER_OAUTH_SECRET = ''
SPOTSEEKER_DAO_CLASS = ''
OAUTH_USER = ''

# scout auth stuff
AUTHENTICATION_BACKENDS = ( '', )
USERSERVICE_ADMIN_GROUP = ''
AUTHZ_GROUP_BACKEND = ''
MANAGER_SUPERUSER_GROUP = ''
