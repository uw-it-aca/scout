"""
A simple functional headless UI test with pyvirtualdisplay and selenium
"""

import os
import sys

from selenium import webdriver
from django.test import LiveServerTestCase
from django.conf import settings

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

from sauceclient import SauceClient
sauce_client = SauceClient(USERNAME, ACCESS_KEY)


class UITest(LiveServerTestCase):

    baseurl = 'http://localhost:8001/'
    
    def setUp(self):

        self.desired_cap = {
            'platform': "Mac OS X 10.9",
            'browserName': "chrome",
            'version': "31",
            'tags': ["ui"] 
        }

        self.driver = webdriver.Remote(
            command_executor='http://'+USERNAME+':'+ACCESS_KEY+'@ondemand.saucelabs.com:80/wd/hub',
            desired_capabilities=self.desired_cap)

        self.driver.implicitly_wait(20)

    def click_id(self, elid):
        self.driver.find_element_by_id(elid).click()

    def go_url(self, urlsuffix = ''):
        self.driver.get(self.baseurl + urlsuffix)

    def click_food(self):
        self.click_id('link_food')

    def click_discover(self):
        self.click_id('link_discover')

    def click_home(self):
        self.click_id('link_home')

    def click_filter(self):
        self.click_id('link_filter')

    def tearDown(self):
        print("https://saucelabs.com/jobs/%s \n" % self.driver.session_id)
        try:
            if sys.exc_info() == (None, None, None):
                sauce_client.jobs.update_job(self.driver.session_id, passed=True)
            else:
                sauce_client.jobs.update_job(self.driver.session_id, passed=False)
        finally:
            self.driver.quit()

    def test_filter_cash(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="UI: Filter Cash")

        self.go_url()
        self.click_food()
        self.click_filter()
        self.driver.find_element_by_value

    """
    Let's test the user location functionality of the app. The app should load
    using the default location (Drumheller fountation). All spots are ordered
    based on this location - with a disctance in feet displayed. The user can
    share their location via HTML5 geolocation and override the default. A new
    marker should be displayed using the shared location and all spots are
    reordered using this new location.
    """
    def test_user_location(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="UI: Test User Location")

        self.driver.get('http://localhost:8001/filter/')
        test = self.driver.find_element_by_id('test')
        self.assertEqual(test.text,"Hello World!")
