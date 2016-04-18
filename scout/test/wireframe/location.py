#!/usr/bin/python
"""
Tests the Wireframe of scout, this particular file incorperates
mock data and tests the navigation incorporating that data
"""

import os
import sys
import os.path
from .. import pages

from selenium import webdriver
from django.test import LiveServerTestCase
from django.conf import settings

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

from sauceclient import SauceClient
sauce_client = SauceClient(USERNAME, ACCESS_KEY)

class AdvNavigationTest(LiveServerTestCase):

    baseurl = 'http://localhost:8001'

    def setUp(self):

        self.desired_cap = {
            'platform': "Mac OS X 10.9",
            'browserName': "chrome",
            'version': "31",
            'tags': ["wireframe"]
        }

        self.driver = webdriver.Remote(
            command_executor='http://%s:%s@ondemand.saucelabs.com:80/wd/hub' % (USERNAME, ACCESS_KEY),
            desired_capabilities=self.desired_cap)

        self.driver.implicitly_wait(20)

    def go_url(self, urlsuffix = ''):
        self.driver.get(self.baseurl + urlsuffix)

    def updateSauceName(self, name):
        sauce_client.jobs.update_job(self.driver.session_id, name=name)

    def tearDown(self):
        try:
            if sys.exc_info() == (None, None, None):
                sauce_client.jobs.update_job(self.driver.session_id, passed=True)
            else:
                sauce_client.jobs.update_job(self.driver.session_id, passed=False)
        finally:
            self.driver.quit()

    def test_breakfast(self):
        """SCOUT-70, testing to see if user can bring up list of b-fast
        places by clicking view more results"""

        self.updateSauceName("Wireframe: Home to Filter Breakfast")
        self.go_url()
        page = pages.HomePage(self.driver)
        page.click_results('breakfast')
        self.assertEqual('page_food', page.pageId)
        self.assertEqual(page.filterBy.text, "Open Period")
        self.assertEqual(page.placesCount.text, "4")

    def test_coffee(self):
        """SCOUT-71, testing to see if user can bring up list of coffee
        places by clicking view more results"""

        self.updateSauceName("Wireframe: Home to Filter Coffee")
        self.go_url()
        page = pages.HomePage(self.driver)
        page.click_results('coffee')
        self.assertEqual('page_food', page.pageId)
        self.assertEqual(page.filterBy.text, "Food Served")
        self.assertEqual(page.placesCount.text, "2")

    def test_open_nearby(self):
        """SCOUT-72, testing to see if user can bring up list of
        places open nearby by clicking view more results"""

        self.updateSauceName("Wireframe: Home to Filter Open Nearby")
        self.go_url()
        page = pages.HomePage(self.driver)
        page.click_results('open')
        self.assertEqual('page_food', page.pageId)
        self.assertEqual(page.filterBy.text, "Open Period")
        self.assertEqual(page.placesCount.text, "8")

    def test_late(self):
        """SCOUT-73, testing to see if user can bring up list of
        places open late by clicking view more results"""

        self.updateSauceName("Wireframe: Home to Filter Open Late")
        self.go_url()
        page = pages.HomePage(self.driver)
        page.click_results('late')
        self.assertEqual('page_food', page.pageId)
        self.assertEqual(page.filterBy.text, "Open Period")
        self.assertEqual(page.placesCount.text, "2")

    def test_details(self):
        """SCOUT-74 testing to see if user can click on a place and
        then see more details from the home page"""

        self.updateSauceName("Wireframe: Home to Details")
        self.go_url()
        page = pages.HomePage(self.driver)
        page.click_place('open', 2)
        tempHref = self.driver.current_url.split('/')
        self.assertIn('page_' + tempHref[len(tempHref) - 2], page.pageId)
        self.assertEqual(page.foodName.text, "Banh & Naan, Husky Den")
        self.assertEqual(page.foodType.text, "FOOD COURT")

    def test_details2(self):
        """SCOUT-75 testing to see if user can click on a place and
        then see more details from the "places" page"""

        self.updateSauceName("Wireframe: Places to Details")
        self.go_url('/food/')
        page = pages.PlacesPage(self.driver)
        page.click_place(3)
        tempHref = self.driver.current_url.split('/')
        self.assertIn('page_' + tempHref[len(tempHref) - 2], page.pageId)
        self.assertEqual(page.foodName.text, "Banh & Naan, Husky Den")
        self.assertEqual(page.foodType.text, "FOOD COURT")

