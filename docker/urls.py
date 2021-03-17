import os
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('scout.urls')),
]
