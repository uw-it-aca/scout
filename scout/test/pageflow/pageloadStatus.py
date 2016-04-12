#!/usr/bin/python
"""
Tests pages and their respective URL status codes
"""

import sys
import unittest
import copy

from django.test import LiveServerTestCase
from django.test import Client
from django.conf import settings

class UrlStatusTest(LiveServerTestCase):

    def clientUrlStatus(self, urlsuffix=''):
        """Returns the status code of the given URL"""
        res = self.client.get(urlsuffix)
        return res.status_code

    def assertUrlStatus(self, urlsuffix='', code=200):
        """Checks to see if the status code of the given URL matches the
        given status code"""
        self.assertEqual(self.clientUrlStatus(urlsuffix), code)

    def test_home_exists(self):
        """Test that the home page results in a 200"""
        # Home Page
        self.assertUrlStatus('/', 200)

    def test_food_exists(self):
        """Test that the food page results in a 200"""
        self.assertUrlStatus('/food/', 200)

    def test_filter_exists(self):
        """Test that the filter page results in a 200"""
        self.assertUrlStatus('/filter/', 200)

    def test_bad_detailURL(self):
        """Ensure a nonexistant space results in a 404 status code"""
        self.assertUrlStatus('/detail/12345679', 404)

    def test_bad_homeURL(self):
        """Test an invalid URL and see if it results in a 404"""
        # Bad URL
        self.assertUrlStatus('/LSFDLK/', 404)
        self.assertUrlStatus('/foood/', 404)

    def test_filter_searchURL(self):
        """Test filter search URL's and see if they result in a 200"""
        self.assertUrlStatus('/food/?open_now=true', 200)
        self.assertUrlStatus('/food/?food0=s_food_espresso', 200)
        self.assertUrlStatus('/food/?period0=breakfast', 200)
        self.assertUrlStatus('/food/?period0=late_night', 200)

    def test_redirect_URLs(self):
        """Test URLs that are meant to redirect(301)"""
        self.assertUrlStatus('/food', 301)
        self.assertUrlStatus('/filter', 301)
