from django.conf.urls import patterns, include, url


urlpatterns = patterns(
    '',
    # application urls
    url(r'^discover/', 'scout.views.discover_view', name='discover_view'),
    url(r'^discover_card/(?P<discover_category>[a-zA-Z]+)/', 'scout.views.discover_card_view', name='discover_card_view'),
    url(r'^map/', 'scout.views.map_view', name='map_view'),
    url(r'^detail/(?P<spot_id>[0-9]{1,5})',
        'scout.views.detail_view', name='detail_view'),
    url(r'^favorites/', 'scout.views.favorites_view', name='favorites_view'),
    url(r'^filter/', 'scout.views.filter_view', name='filter_view'),

    # example hybrid components
    url(r'^components/', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),
    # has to be last!
    url(r'.*', 'scout.views.list_view', name='list_view'),
)
