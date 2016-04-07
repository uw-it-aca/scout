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
#sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
#import pages
from .. import pages

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


class FilterTest(LiveServerTestCase):
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
    def test_filter_set1(self):
        """Filters out the foods that accept cash, asserts the
        right data of places show up"""
        self.updateSauceName('UI: Filter Cash')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'PAYMENT ACCEPTED': {'s_pay_cash': True}})
        page.search()
        self.assertEqual(page.placesCount.text, '4')

    def test_filter_set2(self):
        """Filters out the foods that accept cash and serve American
        cuisine asserts the right data of places show up"""
        self.updateSauceName('UI: Filter Cash + American')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({
            'PAYMENT ACCEPTED': {'s_pay_cash': True},
            'CUISINE': {'s_cuisine_american': True}
        })
        page.search()
        self.assertEqual(page.placesCount.text, '2')

    def test_filter_set3(self):
        """Filters out the food truck, asserts the right data shows up"""
        self.updateSauceName('UI: Filter Food Truck')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'TYPE': {'food_truck': True}})
        page.search()
        self.assertEqual(page.placesCount.text, '1')
        self.assertEqual(page.placesName(0).text, 'Truck of Food')


    def test_filter_set4(self):
        """Filters out the foods that are open now, accept husky/master cards
        and serves burgers"""
        self.updateSauceName('UI: Open + HuskyCard + MasterCard + Burgers')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({
            'PAYMENT ACCEPTED': {'s_pay_husky': True, 's_pay_mastercard': True},
            'FOOD SERVED': {'s_food_burgers': True},
            'OPEN PERIOD': {'open_now': True}
        })
        page.search()
        self.assertEqual(page.placesCount.text, '3')

    def test_filter_set5(self):
        """Filters out the places that are in the Seattle Campus, Cafes, and
        open for breakfast"""
        self.updateSauceName('UI: Seattle + Cafe + Breakfast')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({
            'CAMPUS': {'seattle': True},
            'TYPE': {'cafe': True},
            'OPEN PERIOD': {'breakfast': True}
        })
        page.search()
        self.assertEqual(page.placesCount.text, '2')
