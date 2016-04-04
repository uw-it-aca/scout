from django.conf import settings
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from scout import views

urlpatterns = patterns(
    '',

    # application urls
    url(r'^food/$', 'scout.views.list_view', name='list_view'),

    url(r'^discover_card/(?P<discover_category>[a-zA-Z]+)/',
        'scout.views.discover_card_view',
        name='discover_card_view'),

    url(r'^map/', 'scout.views.map_view', name='map_view'),
    url(r'^detail/(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.detail_view', name='detail_view'),
    url(r'^filter/', 'scout.views.filter_view', name='filter_view'),
    url(r'^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)', views.image_view),

    # hybrid urls
    url(r'^h/food/$', 'scout.views.hybrid_list_view', name='hybrid_list_view'),

    url(r'^h/detail/(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.hybrid_detail_view', name='hybrid_detail_view'),

    url(r'^h/components/', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),
    url(r'^h/filter/', 'scout.views.hybrid_filter_view', name='hybrid_filter_view'),
    url(r'^h/', 'scout.views.hybrid_discover_view', name='hybrid_discover_view'),

    # has to be last!
    url(r'^$', 'scout.views.discover_view', name='discover_view'),

)

# debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += patterns(
        '',
        url(r'^500/$', TemplateView.as_view(template_name='500.html')),
        url(r'^404/$', TemplateView.as_view(template_name='404.html')),
    )
