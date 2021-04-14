import os
from .base_urls import *
from django.urls import include, re_path

urlpatterns += [
    re_path(r'^', include('scout.urls')),
]
