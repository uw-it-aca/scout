#!/usr/bin/python
"""
Tests several filters and determines if the right data
appears on the Places Page
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
        self.assertEqual(page.placesNum, 2)
        self.assertEqual(page.filterBy.text, 'Payment Accepted, Cuisine')

    def test_filter_set3(self):
        """Filters out the food truck, asserts the right data shows up"""
        self.updateSauceName('UI: Filter Food Truck')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'TYPE': {'food_truck': True}})
        page.search()
        self.assertEqual(page.placesNum, 1)
        self.assertEqual(page.filterBy.text, 'Restaurant Type')
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
        self.assertEqual(page.filterBy.text, 'Open Period, Payment Accepted, Food Served')
        self.assertEqual(page.placesNum, 3)

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
        self.assertEqual(page.filterBy.text, 'Campus, Restaurant Type, Open Period')
        self.assertEqual(page.placesNum, 2)

    def test_filter_reset_places_page(self):
        """Filters out places that accept cash, then resets filters on the places
        page"""
        self.updateSauceName('UI: Reset Filter on Places Page')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'PAYMENT ACCEPTED': {'s_pay_cash': True}})
        page.search()
        self.assertEqual(page.placesNum, 4)
        self.assertEqual(page.filterBy.text, 'Payment Accepted')
        page.reset_filters()
        self.assertEqual(page.placesNum, 8)
        self.assertEqual(page.filterBy.text, '--')

    def test_filter_reset_filter_page(self):
        """Filters out places that accept cash and serve American cuisine, then resets
        on the filter page and filters out places with just cash and searches"""
        self.updateSauceName('UI: Reset Filters on Filter Page')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({
            'PAYMENT ACCEPTED': {'s_pay_cash': True},
            'CUISINE': {'s_cuisine_american': True}
        })
        page.reset()
        page.setFilters({'PAYMENT ACCEPTED': {'s_pay_cash': True}})
        page.search()
        self.assertEqual(page.placesNum, 4)
        self.assertEqual(page.filterBy.text, 'Payment Accepted')

    def test_filter_remembered(self):
        """Filters out the places that accept cash, searches, returns to filter page
        to add a filter of American Cuisine, searches (cash should still be checked off)"""
        self.updateSauceName('UI: Filter Remembered')
        self.go_url('/filter/')
        page = pages.FilterPage(self.driver)
        page.setFilters({'PAYMENT ACCEPTED': {'s_pay_cash': True}})
        page.search()
        page.click_home()
        page.click_placestab()
        page.get_filters()
        page.setFilters({'CUISINE': {'s_cuisine_american': True}})
        page.search()
        self.assertEqual(page.placesNum, 2)
        self.assertEqual(page.filterBy.text, 'Payment Accepted, Cuisine')
