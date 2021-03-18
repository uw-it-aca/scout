import os
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('scout.urls')),
    url(r'^', include('django_prometheus.urls')), # add here for django compatibility
]
