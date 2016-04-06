#!/usr/bin/python
"""
A simple functional headless UI test with pyvirtualdisplay and selenium
Links and URLS
"""

import bs4
import sys
import unittest
import copy
import urllib2

from selenium import webdriver
# import wd.parallel
from django.test import LiveServerTestCase
from django.test import Client
from django.conf import settings
from sauceclient import SauceClient

class MainNavigationTest(LiveServerTestCase):
    """Navigation test set for scout"""

    def checkHref(self, exp, loc, response):
        bs = bs4.BeautifulSoup(response.content, "html5lib")
        temp = bs.select(loc)
        self.assertEqual(temp[0].get('href'), exp)
        return self.client.get(temp[0].get('href'))

    # @wd.parallel.multiply
    def test_main_nav(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        response = self.client.get('/')
        dest = self.checkHref('/food/', '#link_food', response)
        dest = self.checkHref('/filter/','#link_filter', dest)
        dest = self.checkHref('/', '#link_discover', dest)
        dest = self.checkHref('/', '#link_home', dest)

    def test_filter_to_home(self):
        response = self.client.get('/filter/')
        self.checkHref('/', '#link_home', response)

    def test_places_to_home(self):
        response = self.client.get('/food/')
        self.checkHref('/', '#link_home', response)

    def test_home_to_home(self):
        response = self.client.get('/')
        self.checkHref('/', '#link_home', response)

    def test_filter_to_food(self):
        response = self.client.get('/filter/')
        self.checkHref('/food/', '#link_food', response)
