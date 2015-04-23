from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response

import urllib
import json

# create your views here

def home_view(request):
    return render_to_response('scout/home.html', context_instance=RequestContext(request))
    
def favorites_view(request):
    return render_to_response('scout/favorites.html', context_instance=RequestContext(request))
    
def map_view(request):
    return render_to_response('scout/map.html', context_instance=RequestContext(request))

def list_view(request):
    return render_to_response('scout/list.html', context_instance=RequestContext(request))

def detail_view(request):
    return render_to_response('scout/detail.html', context_instance=RequestContext(request))
      
def filters_view(request):
    return render_to_response('scout/filters.html', context_instance=RequestContext(request))