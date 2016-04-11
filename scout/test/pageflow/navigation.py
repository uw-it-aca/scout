#!/usr/bin/python
"""
Tests the general navigation of the application
Testing the flow between pages through links
"""

import bs4
import sys
import unittest
import copy
import urllib2

# import wd.parallel
from django.test import LiveServerTestCase
from django.test import Client
from django.conf import settings
from sauceclient import SauceClient

class MainNavigationTest(LiveServerTestCase):
    """Navigation test set for scout"""

    def checkHrefBySelector(self, exp, selector, response):
        """Given a selector, ensure that the first link found with that
        selector has an href matching 'exp'., returns the response
        of the href."""
        bs = bs4.BeautifulSoup(response.content, "html5lib")
        link = bs.select(selector)[0]
        self.checkHref(link, exp)
        return self.client.get(exp)

    def checkHref(self, link, expectedLoc):
        """Given a link, ensure that its href is the same as expectedLoc"""
        linkHref = link.get('href')
        self.assertEqual(linkHref, expectedLoc)

    # @wd.parallel.multiply
    def test_main_nav(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        response = self.client.get('/')
        dest = self.checkHrefBySelector('/food/', '#link_food', response)
        dest = self.checkHrefBySelector('/filter/','#link_filter', dest)
        dest = self.checkHrefBySelector('/', '#link_discover', dest)
        dest = self.checkHrefBySelector('/', '#link_home', dest)

    def test_filter_to_home(self):
        """Tests the home logo link on the filter page"""
        response = self.client.get('/filter/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_places_to_home(self):
        """Tests the home logo link on the places page"""
        response = self.client.get('/food/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_home_to_home(self):
        """Tests the home logo link on the home page"""
        response = self.client.get('/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_filter_to_food(self):
        """Tests the food tab link on the filter page"""
        response = self.client.get('/filter/')
        self.checkHrefBySelector('/food/', '#link_food', response)

    def get_soup(self, page):
        """Returns a soup object given a path"""
        response = self.client.get(page)
        return bs4.BeautifulSoup(response.content, "html5lib")

    def check_footer_links_at_path(self, path):
        """Checks the footer links at the given path"""
        soup = self.get_soup(path)
        self.check_footer_links(soup)

    def check_footer_links(self, soup):
        """Checks the footer links at the given soup"""
        footerLinks = soup.select('div#footer a')
        privacyLink, termsLink = footerLinks
        self.assertEqual(privacyLink.get('href'), 'http://www.washington.edu/online/privacy/')
        self.assertEqual(termsLink.get('href'), 'http://www.washington.edu/online/terms/')

    def test_footer_links_home(self):
        """Checks the privacy/terms on the home page"""
        self.check_footer_links_at_path('/')

    def test_footer_links_food(self):
        """Checks the privacy/terms on the places page"""
        self.check_footer_links_at_path('/food/')

    def test_footer_links_filter(self):
        """Checks the privacy/terms on the filter page"""
        self.check_footer_links_at_path('/filter/')

    def test_footer_links_detail(self):
        """Checks the privacy/terms on the detail page"""
        self.check_footer_links_at_path('/detail/1/')
