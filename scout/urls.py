from django.conf import settings
from django.conf.urls import url, handler404
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from scout import views
from scout.views import DiscoverView
from scout.views import DiscoverCardView

from scout.views import PlaceHolderView
from scout.views import FoodListView
from scout.views import FoodDetailView
from scout.views import FoodFilterView

from scout.views import StudyListView
from scout.views import StudyDetailView
from scout.views import StudyFilterView

from scout.views import TechListView
from scout.views import TechDetailView
from scout.views import TechFilterView


# Temporarily catch all pages.
show_newssplash = getattr(settings, "SCOUT_SHOW_NEWSSPLASH", False)
if show_newssplash:
    urlpatterns = [
        "",
        # news splash
        url(
            r"^.*$",
            views.NewsSplashView.as_view(),
            {"template_name": "newssplash.html"},
            name="newssplash",
        ),
    ]
else:
    urlpatterns = [
        # home
        url(r"^$", RedirectView.as_view(url="/seattle", permanent=True), name="true"),
        # discover
        url(
            r"^(?P<campus>[^/]+)/$",
            DiscoverView.as_view(),
            {"template_name": "scout/discover.html"},
            name="discover",
        ),
        url(
            r"^(?P<campus>[^/]+)/discover_card/(?P<discover_category>[a-zA-Z]+"
            ")/$",
            DiscoverCardView.as_view(),
            {"template_name": "scout/discover_card.html"},
            name="discovercard",
        ),
        # food
        url(
            r"^(?P<campus>[^/]+)/food/$",
            FoodListView.as_view(),
            {"template_name": "scout/food/list.html"},
            name="foodlist",
        ),
        url(
            r"^(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$",
            FoodDetailView.as_view(),
            {"template_name": "scout/food/detail.html"},
            name="fooddetail",
        ),
        url(
            r"^(?P<campus>[^/]+)/food/filter/$",
            FoodFilterView.as_view(),
            {"template_name": "scout/food/filter.html"},
            name="foodfilter",
        ),
        # study
        url(
            r"^(?P<campus>[^/]+)/study/$",
            StudyListView.as_view(),
            {"template_name": "scout/study/list.html"},
            name="studylist",
        ),
        url(
            r"^(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$",
            StudyDetailView.as_view(),
            {"template_name": "scout/study/detail.html"},
            name="studydetail",
        ),
        url(
            r"^(?P<campus>[^/]+)/study/filter/$",
            StudyFilterView.as_view(),
            {"template_name": "scout/study/filter.html"},
            name="studyfilter",
        ),
        # tech
        url(
            r"^(?P<campus>[^/]+)/tech/$",
            TechListView.as_view(),
            {"template_name": "scout/tech/list.html"},
            name="techlist",
        ),
        url(
            r"^(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$",
            TechDetailView.as_view(),
            {"template_name": "scout/tech/detail.html"},
            name="techdetail",
        ),
        url(
            r"^(?P<campus>[^/]+)/tech/filter/$",
            TechFilterView.as_view(),
            {"template_name": "scout/tech/filter.html"},
            name="techfilter",
        ),
        # hybrid home
        url(r"^h/$", RedirectView.as_view(url="/h/seattle"), name="hybridhome"),
        # hybrid discover
        url(
            r"^h/(?P<campus>[^/]+)/$",
            DiscoverView.as_view(),
            {"template_name": "hybridize/discover.html"},
            name="hybriddiscover",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/discover_card/"
            "(?P<discover_category>[a-zA-Z]+)/$",
            DiscoverCardView.as_view(),
            {"template_name": "hybridize/discover_card.html"},
            name="hybriddiscovercard",
        ),
        # hybrid food
        url(
            r"^h/(?P<campus>[^/]+)/food/$",
            PlaceHolderView.as_view(),
            {"template_name": "hybridize/food/list.html", "app_type": "food"},
            name="hybridfoodlist",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/food/list/$",
            FoodListView.as_view(),
            {
                "template_name": "hybridize/food/list_content.html",
                "app_type": "food",
            },
            name="hybridfoodlistcontent",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$",
            FoodDetailView.as_view(),
            {"template_name": "hybridize/food/detail.html"},
            name="hybridfooddetail",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/food/filter/$",
            FoodFilterView.as_view(),
            {"template_name": "hybridize/food/filter.html"},
            name="hybridfoodfilter",
        ),
        # hybrid study
        url(
            r"^h/(?P<campus>[^/]+)/study/$",
            PlaceHolderView.as_view(),
            {
                "template_name": "hybridize/study/list.html",
                "app_type": "study",
            },
            name="hybridstudylist",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/study/list/$",
            StudyListView.as_view(),
            {
                "template_name": "hybridize/study/list_content.html",
                "app_type": "study",
            },
            name="hybridstudylistcontent",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$",
            StudyDetailView.as_view(),
            {"template_name": "hybridize/study/detail.html"},
            name="hybridstudydetail",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/study/filter/$",
            StudyFilterView.as_view(),
            {"template_name": "hybridize/study/filter.html"},
            name="hybridstudyfilter",
        ),
        # hybrid tech
        url(
            r"^h/(?P<campus>[^/]+)/tech/$",
            PlaceHolderView.as_view(),
            {"template_name": "hybridize/tech/list.html", "app_type": "tech"},
            name="hybridtechlist",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/tech/list/$",
            TechListView.as_view(),
            {
                "template_name": "hybridize/tech/list_content.html",
                "app_type": "tech",
            },
            name="hybridtechlist",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$",
            TechDetailView.as_view(),
            {"template_name": "hybridize/tech/detail.html"},
            name="hybridtechdetail",
        ),
        url(
            r"^h/(?P<campus>[^/]+)/tech/filter/$",
            TechFilterView.as_view(),
            {"template_name": "hybridize/tech/filter.html"},
            name="hybridtechfilter",
        ),
        # images
        url(
            r"^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)/$",
            views.spot_image_view,
            name="spotimage",
        ),
        url(
            r"^item/images/(?P<item_id>\d+)/image/(?P<image_id>\d+)/$",
            views.item_image_view,
            name="itemimage",
        ),
    ]


# debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += [
        url(r"^500/$", TemplateView.as_view(template_name="500.html"), name="500_response"),
        url(r"^404/$", views.custom_404_response, name="custom_404_response",),
    ]
