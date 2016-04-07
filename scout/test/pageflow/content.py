#!/usr/bin/python
"""
Tests the contents of each page, making sure the
structure of the page is correct
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

class ContentTest(LiveServerTestCase):
    """Content test set for scout"""

    def returnSoup(self, url):
        response = self.client.get(url)
        return bs4.BeautifulSoup(response.content, "html5lib")

    # @wd.parallel.multiply
    def test_home_content(self):
        """Test that the content on the home page is correct"""
        bs = self.returnSoup('')
        checkId = bs.select('#page_discover')
        self.assertGreater(len(checkId), 0)

    # @wd.parallel.multiply
    def test_food_content(self):
        """Test that the content on the food page is correct"""
        bs = self.returnSoup('/food/')
        checkId = bs.select('#page_food')
        self.assertGreater(len(checkId), 0)
        filterButtons = bs.select('.scout-filter-results-action')
        self.assertEqual(filterButtons[0].getText(), 'Filter results')
        self.assertEqual(filterButtons[1].getText(), 'Reset filter')

    # @wd.parallel.multiply
    def test_detail_content(self):
        """Test that the content on the detail page is correct"""
        bs = self.returnSoup('/food/')
        places = bs.select('ol li a')
        # clicking the first place on the list
        tempHref = places[0].get('href')
        bs = self.returnSoup(tempHref)
        spotName = bs.select('.scout-spot-name')
        tempUrl = tempHref.split('/')
        scoutContent = bs.select('.scout-content')
        self.assertEqual('page_' + tempUrl[len(tempUrl) - 2], scoutContent[0].get('id'))

    # @wd.parallel.multiply
    def test_filter_content(self):
        """Test that the content on the filter page is correct"""
        bs = self.returnSoup('/filter/')
        checkId = bs.select('#page_filter')
        self.assertGreater(len(checkId), 0)
        legends = bs.select('legend')
        self.assertEqual(legends[0].text, 'Campus')
