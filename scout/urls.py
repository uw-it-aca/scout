from django.conf import settings
from django.conf.urls import patterns, include, url, handler404
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from scout import views
from scout.views import DiscoverView
from scout.views import DiscoverCardView

from scout.views import FoodListView
from scout.views import FoodDetailView
from scout.views import FoodFilterView

from scout.views import StudyListView
from scout.views import StudyDetailView
from scout.views import StudyFilterView

from scout.views import TechListView
from scout.views import TechDetailView
from scout.views import TechFilterView

from scout.views import HybridFoodListView

urlpatterns = patterns(
    '',
    # home
    url(r'^$', RedirectView.as_view(url='/seattle')),

    # discover
    url(r'^(?P<campus>[^/]+)/$',
        DiscoverView.as_view(), {"template_name": "scout/discover.html"}),
    url(r'^(?P<campus>[^/]+)/discover_card/(?P<discover_category>[a-zA-Z]+)/$',
        DiscoverCardView.as_view(),
        {"template_name": "scout/discover_card.html"}),

    # food
    url(r'^(?P<campus>[^/]+)/food/$',
        FoodListView.as_view(), {"template_name": "scout/food/list.html"}),
    url(r'^(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$',
        FoodDetailView.as_view(), {"template_name": "scout/food/detail.html"}),
    url(r'^(?P<campus>[^/]+)/food/filter/$',
        FoodFilterView.as_view(), {"template_name": "scout/food/filter.html"}),

    # study
    url(r'^(?P<campus>[^/]+)/study/$',
        StudyListView.as_view(), {"template_name": "scout/study/list.html"}),
    url(r'^(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$',
        StudyDetailView.as_view(),
        {"template_name": "scout/study/detail.html"}),
    url(r'^(?P<campus>[^/]+)/study/filter/$',
        StudyFilterView.as_view(),
        {"template_name": "scout/study/filter.html"}),

    # tech
    url(r'^(?P<campus>[^/]+)/tech/$',
        TechListView.as_view(), {"template_name": "scout/tech/list.html"}),
    url(r'^(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$',
        TechDetailView.as_view(), {"template_name": "scout/tech/detail.html"}),
    url(r'^(?P<campus>[^/]+)/tech/filter/$',
        TechFilterView.as_view(), {"template_name": "scout/tech/filter.html"}),

    # hybrid home
    url(r'^h/$', RedirectView.as_view(url='/h/seattle')),

    # hybrid discover
    url(r'^h/(?P<campus>[^/]+)/$',
        DiscoverView.as_view(), {"template_name": "hybridize/discover.html"}),
    url(r'^h/(?P<campus>[^/]+)/discover_card/'
        '(?P<discover_category>[a-zA-Z]+)/$',
        DiscoverCardView.as_view(),
        {"template_name": "hybridize/discover_card.html"}),

    # hybrid food
    url(r'^h/(?P<campus>[^/]+)/food/$',
        HybridFoodListView.as_view(), {"template_name":
                                       "hybridize/food/list.html"}),
    url(r'^h/(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$',
        FoodDetailView.as_view(),
        {"template_name": "hybridize/food/detail.html"}),
    url(r'^h/(?P<campus>[^/]+)/food/filter/$',
        FoodFilterView.as_view(),
        {"template_name": "hybridize/food/filter.html"}),

    # hybrid study
    url(r'^h/(?P<campus>[^/]+)/study/$',
        StudyListView.as_view(),
        {"template_name": "hybridize/study/list.html"}),
    url(r'^h/(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$',
        StudyDetailView.as_view(),
        {"template_name": "hybridize/study/detail.html"}),
    url(r'^h/(?P<campus>[^/]+)/study/filter/$',
        StudyFilterView.as_view(),
        {"template_name": "hybridize/study/filter.html"}),

    # hybrid tech
    url(r'^h/(?P<campus>[^/]+)/tech/$',
        TechListView.as_view(), {"template_name": "hybridize/tech/list.html"}),
    url(r'^h/(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$',
        TechDetailView.as_view(),
        {"template_name": "hybridize/tech/detail.html"}),
    url(r'^h/(?P<campus>[^/]+)/tech/filter/$',
        TechFilterView.as_view(),
        {"template_name": "hybridize/tech/filter.html"}),

    # hybrid components
    url(r'^h/components/$', 'scout.views.hybrid_comps_view',
        name='hybrid_comps_view'),

    # images
    url(r'^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)/$',
        views.spot_image_view),
    url(r'^item/images/(?P<item_id>\d+)/image/(?P<image_id>\d+)/$',
        views.item_image_view),

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
