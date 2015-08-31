from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response

import urllib
import json

# create your views here

def home_view(request):
    return render_to_response('scout/home.html', context_instance=RequestContext(request))
    
def map_view(request):
    return render_to_response('scout/map.html', context_instance=RequestContext(request))

def filters_view(request):
    return render_to_response('scout/filters.html', context_instance=RequestContext(request))

def favorites_view(request):
    
    hybridapp = request.GET.get('hybrid')
    
    if hybridapp:
        base_template = 'scout/base-hybrid.html'
    else:
        base_template = 'scout/base-web.html'
    
    params = { 'base_template': base_template }
    
    return render_to_response('scout/favorites.html', params, context_instance=RequestContext(request))
        
def list_view(request):
    
    hybridapp = request.GET.get('hybrid')
    
    if hybridapp:
        base_template = 'scout/base-hybrid.html'
    else:
        base_template = 'scout/base-web.html'
    
    params = { 'base_template': base_template }
    
    return render_to_response('scout/list.html', params, context_instance=RequestContext(request))

def detail_view(request):
    
    hybridapp = request.GET.get('hybrid')
    
    if hybridapp:
        base_template = 'scout/base-hybrid.html'
    else:
        base_template = 'scout/base-web.html'
    
    params = { 'base_template': base_template }
    
    return render_to_response('scout/detail.html', params, context_instance=RequestContext(request))
