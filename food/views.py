from django.shortcuts import render

# Create your views here.

from django.conf import settings
from django.template import RequestContext
from django.shortcuts import render_to_response

import urllib
import json

# create your views here

def eatery_list(request):
    return render_to_response('food/list.html', context_instance=RequestContext(request))

def eatery_detail(request):
    return render_to_response('food/detail.html', context_instance=RequestContext(request))