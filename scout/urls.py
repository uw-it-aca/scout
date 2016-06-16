from django.conf import settings
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from scout import views

urlpatterns = patterns(
    '',
    # home
    url(r'^$', 'scout.views.discover_view', name='discover_view'),

    # food
    url(r'^food/$', 'scout.views.food_list_view', name='food_list_view'),
    url(r'^food/filter/$', 'scout.views.food_filter_view',
        name='food_filter_view'),

    # study
    url(r'^study/$', 'scout.views.study_list_view', name='study_list_view'),

    # technology
    url(r'^tech/$', 'scout.views.tech_list_view', name='tech_list_view'),

    # spot details
    url(r'^detail/(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.detail_view', name='detail_view'),

    # images
    url(r'^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)/$',
        views.image_view),

    # discover card
    url(r'^discover_card/(?P<discover_category>[a-zA-Z]+)/$',
        'scout.views.discover_card_view',
        name='discover_card_view'),

    # hybrid urls
    url(r'^h/$', 'scout.views.hybrid_discover_view',
        name='hybrid_discover_view'),
    url(r'^h/food/$', 'scout.views.hybrid_list_view', name='hybrid_list_view'),
    url(r'^h/detail/(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.hybrid_detail_view', name='hybrid_detail_view'),
    url(r'^h/components/$', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),
    url(r'^h/filter/$', 'scout.views.hybrid_filter_view',
        name='hybrid_filter_view'),

)

# debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += patterns(
        '',
        url(r'^500/$', TemplateView.as_view(template_name='500.html')),
        url(r'^404/$', TemplateView.as_view(template_name='404.html')),
    )
