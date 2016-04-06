#!/usr/bin/python
"""
A simple functional headless UI test with pyvirtualdisplay and selenium
Links and URLS
"""

import bs4
import sys
import unittest
import copy
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
import pages

from selenium import webdriver
# import wd.parallel
from django.test import LiveServerTestCase
from django.test import Client
from django.conf import settings
from sauceclient import SauceClient

# False - runs locally, True - runs on SauceLabs
useSauce = True

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

sauce_client = SauceClient(USERNAME, ACCESS_KEY)


class UITest(LiveServerTestCase):
    """UI test set for scout"""

    def setUp(self):
        self.client = Client()
        self.baseurl = 'http://localhost:8001'
        self.desired_cap = {
            'platform': 'Mac OS X 10.9',
            'browserName': 'chrome',
            'version': '31',
            'tags': ['pageflow']
        }
        self.useSauce = useSauce

        if useSauce:
            sauceUrl = 'http://%s:%s@ondemand.saucelabs.com:80/wd/hub' \
                % (USERNAME, ACCESS_KEY)
            self.driver = webdriver.Remote(
                command_executor=sauceUrl,
                desired_capabilities=self.desired_cap)
        else:
            self.driver = webdriver.Firefox()
        # self.driver.implicitly_wait(20)

    # @wd.parallel.multiply
    def tearDown(self):
        # print('https://saucelabs.com/jobs/%s \n' % self.driver.session_id)
        if self.useSauce:
            if sys.exc_info() == (None, None, None):
                sauce_client.jobs.update_job(
                    self.driver.session_id,
                    passed=True)
            else:
                sauce_client.jobs.update_job(
                    self.driver.session_id,
                    passed=False)
        self.driver.quit()

    def go_url(self, urlsuffix=''):
        """Has the driver go to the given URL"""
        self.driver.get(self.baseurl + urlsuffix)

    def updateSauceName(self, name):
        """Sets the saucelabs job name"""
        if self.useSauce:
            sauce_client.jobs.update_job(self.driver.session_id, name=name)

    # @wd.parallel.multiply
    def test_filter_cash(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        self.updateSauceName('UI: Filter Cash')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'CAMPUS': {'seattle': True}, 'OPEN PERIOD': {'open_now': True}})
        page.search()
