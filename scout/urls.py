# Copyright 2021 UW-IT, University of Washington
# SPDX-License-Identifier: Apache-2.0

from django.conf import settings
from django.urls import re_path
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
        # news splash
        re_path(
            r"^.*$",
            views.NewsSplashView.as_view(),
            {"template_name": "newssplash.html"},
            name="newssplash",
        ),
    ]
else:
    urlpatterns = [
        # home
        re_path(
            r"^$",
            RedirectView.as_view(url="/seattle", permanent=True),
            name="true",
        ),
        # discover
        re_path(
            r"^(?P<campus>[^/]+)/$",
            DiscoverView.as_view(),
            {"template_name": "scout/discover.html"},
            name="discover",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/discover_card/(?P<discover_category>[a-zA-Z]+"
            ")/$",
            DiscoverCardView.as_view(),
            {"template_name": "scout/discover_card.html"},
            name="discovercard",
        ),
        # food
        re_path(
            r"^(?P<campus>[^/]+)/food/$",
            FoodListView.as_view(),
            {"template_name": "scout/food/list.html"},
            name="foodlist",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$",
            FoodDetailView.as_view(),
            {"template_name": "scout/food/detail.html"},
            name="fooddetail",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/food/filter/$",
            FoodFilterView.as_view(),
            {"template_name": "scout/food/filter.html"},
            name="foodfilter",
        ),
        # study
        re_path(
            r"^(?P<campus>[^/]+)/study/$",
            StudyListView.as_view(),
            {"template_name": "scout/study/list.html"},
            name="studylist",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$",
            StudyDetailView.as_view(),
            {"template_name": "scout/study/detail.html"},
            name="studydetail",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/study/filter/$",
            StudyFilterView.as_view(),
            {"template_name": "scout/study/filter.html"},
            name="studyfilter",
        ),
        # tech
        re_path(
            r"^(?P<campus>[^/]+)/tech/$",
            TechListView.as_view(),
            {"template_name": "scout/tech/list.html"},
            name="techlist",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$",
            TechDetailView.as_view(),
            {"template_name": "scout/tech/detail.html"},
            name="techdetail",
        ),
        re_path(
            r"^(?P<campus>[^/]+)/tech/filter/$",
            TechFilterView.as_view(),
            {"template_name": "scout/tech/filter.html"},
            name="techfilter",
        ),
        # hybrid home
        re_path(
            r"^h/$", RedirectView.as_view(url="/h/seattle"), name="hybridhome"
        ),
        # hybrid discover
        re_path(
            r"^h/(?P<campus>[^/]+)/$",
            DiscoverView.as_view(),
            {"template_name": "hybridize/discover.html"},
            name="hybriddiscover",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/discover_card/"
            "(?P<discover_category>[a-zA-Z]+)/$",
            DiscoverCardView.as_view(),
            {"template_name": "hybridize/discover_card.html"},
            name="hybriddiscovercard",
        ),
        # hybrid food
        re_path(
            r"^h/(?P<campus>[^/]+)/food/$",
            PlaceHolderView.as_view(),
            {"template_name": "hybridize/food/list.html", "app_type": "food"},
            name="hybridfoodlist",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/food/list/$",
            FoodListView.as_view(),
            {
                "template_name": "hybridize/food/list_content.html",
                "app_type": "food",
            },
            name="hybridfoodlistcontent",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/food/(?P<spot_id>[0-9]{1,5})/$",
            FoodDetailView.as_view(),
            {"template_name": "hybridize/food/detail.html"},
            name="hybridfooddetail",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/food/filter/$",
            FoodFilterView.as_view(),
            {"template_name": "hybridize/food/filter.html"},
            name="hybridfoodfilter",
        ),
        # hybrid study
        re_path(
            r"^h/(?P<campus>[^/]+)/study/$",
            PlaceHolderView.as_view(),
            {
                "template_name": "hybridize/study/list.html",
                "app_type": "study",
            },
            name="hybridstudylist",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/study/list/$",
            StudyListView.as_view(),
            {
                "template_name": "hybridize/study/list_content.html",
                "app_type": "study",
            },
            name="hybridstudylistcontent",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/study/(?P<spot_id>[0-9]{1,5})/$",
            StudyDetailView.as_view(),
            {"template_name": "hybridize/study/detail.html"},
            name="hybridstudydetail",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/study/filter/$",
            StudyFilterView.as_view(),
            {"template_name": "hybridize/study/filter.html"},
            name="hybridstudyfilter",
        ),
        # hybrid tech
        re_path(
            r"^h/(?P<campus>[^/]+)/tech/$",
            PlaceHolderView.as_view(),
            {"template_name": "hybridize/tech/list.html", "app_type": "tech"},
            name="hybridtechlist",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/tech/list/$",
            TechListView.as_view(),
            {
                "template_name": "hybridize/tech/list_content.html",
                "app_type": "tech",
            },
            name="hybridtechlist",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/tech/(?P<item_id>[0-9]{1,5})/$",
            TechDetailView.as_view(),
            {"template_name": "hybridize/tech/detail.html"},
            name="hybridtechdetail",
        ),
        re_path(
            r"^h/(?P<campus>[^/]+)/tech/filter/$",
            TechFilterView.as_view(),
            {"template_name": "hybridize/tech/filter.html"},
            name="hybridtechfilter",
        ),
        # images
        re_path(
            r"^images/(?P<spot_id>\d+)/image/(?P<image_id>\d+)/$",
            views.spot_image_view,
            name="spotimage",
        ),
        re_path(
            r"^item/images/(?P<item_id>\d+)/image/(?P<image_id>\d+)/$",
            views.item_image_view,
            name="itemimage",
        ),
    ]


# debug routes for developing error pages
if settings.DEBUG:
    urlpatterns += [
        re_path(
            r"^500/$",
            TemplateView.as_view(template_name="500.html"),
            name="500_response",
        ),
        re_path(r"^404/$",
                views.custom_404_response, name="custom_404_response",),
    ]
