import os
from django.conf.urls import include, url

urlpatterns = [
    url(r'^', include('django_prometheus.urls')),
    url(r'^', include('scout.urls')),
]
