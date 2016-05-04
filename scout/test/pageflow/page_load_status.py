#!/usr/bin/python
"""
Tests pages and their respective URL status codes
"""

import sys
from django.test import TestCase

class UrlStatusTest(TestCase):

    def clientUrlStatus(self, urlsuffix=''):
        """Returns the status code of the given URL"""
        res = self.client.get(urlsuffix)
        return res.status_code

    def assertUrlStatus(self, urlsuffix='', code=200):
        """Checks to see if the status code of the given URL matches the
        given status code"""
        self.assertEqual(self.clientUrlStatus(urlsuffix), code)

    def test_home_exists(self):
        """SCOUT-52 Test that the home page results in a 200"""
        # Home Page
        self.assertUrlStatus('/', 200)

    def test_food_exists(self):
        """SCOUT-53 Test that the food page results in a 200"""
        self.assertUrlStatus('/food/', 200)

    def test_filter_exists(self):
        """SCOUT-54 Test that the filter page results in a 200"""
        self.assertUrlStatus('/filter/', 200)

    def test_bad_detailURL(self):
        """SCOUT-55 Ensure a nonexistant space results in a 404 status code"""
        self.assertUrlStatus('/detail/12345679', 404)
        self.assertUrlStatus('/detail/asdf', 404)

    def test_bad_homeURL(self):
        """SCOUT-56 Test an invalid URL and see if it results in a 404"""
        # Bad URL
        self.assertUrlStatus('/LSFDLK/', 404)
        self.assertUrlStatus('/foood/', 404)

    def test_filter_search_openURL(self):
        """SCOUT-76 Test home search URL and see if it results in a 200"""
        self.assertUrlStatus('/food/?open_now=true', 200)

    def test_filter_search_coffeeURL(self):
        """SCOUT-77 Test food search URL and see if it results in a 200"""
        self.assertUrlStatus('/food/?food0=s_food_espresso', 200)

    def test_filter_search_breakfastURL(self):
        """SCOUT-79 Test breakfast search URL and see if it results in a 200"""
        self.assertUrlStatus('/food/?period0=breakfast', 200)

    def test_filter_search_lateURL(self):
        """SCOUT-78 Test late night search URL and see if it results in a 200"""
        self.assertUrlStatus('/food/?period0=late_night', 200)

    def test_filter_search_404(self):
        """SCOUT-80 Test a search URL's that should return a 404"""
        self.assertUrlStatus('/food/?open_now=plzgivemea404', 404)
        self.assertUrlStatus('/food/?period0', 404)
        self.assertUrlStatus('/food/?food0', 404)
        self.assertUrlStatus('/food/?plzgimmea404', 404)

    def test_filter_addon_404(self):
        """SCOUT-81 Test a filter URL that should return a 404"""
        self.assertUrlStatus('/filter/404', 404)

    def test_redirect_URLs(self):
        """SCOUT-57 Test URLs that are meant to redirect(301)"""
        self.assertUrlStatus('/food', 301)
        self.assertUrlStatus('/filter', 301)
