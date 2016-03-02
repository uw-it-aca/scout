from django.conf.urls import patterns, include, url
from scout import views

urlpatterns = patterns(
    '',
    # application urls
    url(r'^food/', 'scout.views.list_view', name='list_view'),

    url(r'^discover_card/(?P<discover_category>[a-zA-Z]+)/',
        'scout.views.discover_card_view',
        name='discover_card_view'),

    url(r'^map/', 'scout.views.map_view', name='map_view'),
    url(r'^detail/(?P<spot_id>[0-9]{1,5})',
        'scout.views.detail_view', name='detail_view'),
    url(r'^filter/', 'scout.views.filter_view', name='filter_view'),
    url(r'^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)', views.image_view),

    # example hybrid components
    url(r'^components/', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),

    # has to be last!
    url(r'.*', 'scout.views.discover_view', name='discover_view'),
)
