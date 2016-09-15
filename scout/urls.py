from django.conf import settings
from django.conf.urls import patterns, include, url, handler404
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from scout import views


urlpatterns = patterns(
    '',
    # home
    url(r'^$', RedirectView.as_view(url='/seattle')),

    # hybrid home
    url(r'^h/$', RedirectView.as_view(url='/h/seattle')),
    url(r'^h/(?P<campus>[^/]+)/$',
        'scout.views.hybrid_discover_view', name='hybrid_discover_view'),

    # hybrid food
    url(r'^h/(?P<campus>[^/]+)/food/$',
        'scout.views.hybrid_food_list_view', name='hybrid_food_list_view'),
    url(r'^h/(?P<campus>[^/]+)/food/'
        '(?P<spot_id>[0-9]{1,5})/$', 'scout.views.hybrid_food_detail_view',
        name='hybrid_food_detail_view'),
    url(r'^h/(?P<campus>[^/]+)/food/filter/$',
        'scout.views.hybrid_food_filter_view', name='hybrid_food_filter_view'),

    # hybrid study
    url(r'^h/(?P<campus>[^/]+)/study/$',
        'scout.views.hybrid_study_list_view', name='hybrid_study_list_view'),
    url(r'^h/(?P<campus>[^/]+)/study/'
        '(?P<spot_id>[0-9]{1,5})/$', 'scout.views.hybrid_study_detail_view',
        name='hybrid_study_detail_view'),

    # hybrid tech
    url(r'^h/(?P<campus>[^/]+)/tech/$',
        'scout.views.hybrid_tech_list_view', name='hybrid_tech_list_view'),
    url(r'^h/(?P<campus>[^/]+)/food/$',
        'scout.views.hybrid_food_list_view',
        name='hybrid_food_list_view'),

    url(r'^h/(?P<campus>[^/]+)/food/'
        r'(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.hybrid_food_detail_view',
        name='hybrid_food_detail_view'),
    url(r'^h/(?P<campus>[^/]+)/food/filter/$',
        'scout.views.hybrid_food_filter_view',
        name='hybrid_food_filter_view'),

    # hybrid study
    url(r'^h/(?P<campus>[^/]+)/study/$',
        'scout.views.hybrid_study_list_view',
        name='hybrid_study_list_view'),
    url(r'^h/(?P<campus>[^/]+)/study/'
        r'(?P<spot_id>[0-9]{1,5})/$',
        'scout.views.hybrid_study_detail_view',
        name='hybrid_study_detail_view'),

    # hybrid tech
    url(r'^h/(?P<campus>[^/]+)/tech/$',
        'scout.views.hybrid_tech_list_view',
        name='hybrid_tech_list_view'),

    # hybrid components
    url(r'^h/components/$', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),

    # campus discovery
    url(r'^(?P<campus>[^/]+)/$',
        'scout.views.discover_view', name='discover_view'),

    # food
    url(r'^(?P<campus>[^/]+)/food/$',
        'scout.views.food_list_view', name='food_list_view'),
    url(r'^(?P<campus>[^/]+)/food/'
        '(?P<spot_id>[0-9]{1,5})/$', 'scout.views.food_detail_view',
        name='food_detail_view'),
    url(r'^(?P<campus>[^/]+)/food/filter/$',
        'scout.views.food_filter_view', name='food_filter_view'),

    # study
    url(r'^(?P<campus>[^/]+)/study/$',
        'scout.views.study_list_view', name='study_list_view'),
    url(r'^(?P<campus>[^/]+)/study/'
        '(?P<spot_id>[0-9]{1,5})/$', 'scout.views.study_detail_view',
        name='study_detail_view'),
    url(r'^(?P<campus>[^/]+)/study/filter/$',
        'scout.views.study_filter_view', name='study_filter_view'),

    # technology
    url(r'^(?P<campus>[^/]+)/tech/$',
        'scout.views.tech_list_view', name='tech_list_view'),
    url(r'^(?P<campus>[^/]+)/tech/'
        '(?P<item_id>[0-9]{1,5})/$', 'scout.views.tech_detail_view',
        name='tech_detail_view'),
    url(r'^(?P<campus>[^/]+)/tech/filter/$',
        'scout.views.tech_filter_view', name='tech_filter_view'),

    # images
    url(r'^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)/$',
        views.image_view),

    # discover card
    url(r'^(?P<campus>[^/]+)/discover_card/(?P<discover_category>[a-zA-Z]+)/$',
        'scout.views.discover_card_view',
        name='discover_card_view'),


)


# debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += patterns(
        '',
        url(r'^500/$', TemplateView.as_view(template_name='500.html')),
        url(r'^404/$',
            'scout.views.custom_404_response',
            name='custom_404_response'),
    )
