from .base_urls import *
from django.urls import re_path, include

urlpatterns += [
    re_path(r'^', include('pivot.urls')),
]
