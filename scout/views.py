from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response

import urllib
import json

# create your views here

def favorites_list(request):
    return render_to_response('scout/favorites.html', context_instance=RequestContext(request))
    
def map_display(request):
    return render_to_response('scout/map.html', context_instance=RequestContext(request))