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

class PageFlowTest(LiveServerTestCase):

    def setUp(self):

        self.desired_cap = {
            "name": "Pageflow Tests",
            'platform': "Mac OS X 10.9",
            'browserName': "chrome",
            'version': "31",
        }

        self.driver = webdriver.Remote(
            command_executor='http://'+USERNAME+':'+ACCESS_KEY+'@ondemand.saucelabs.com:80/wd/hub',
            desired_capabilities=self.desired_cap)

        # self.driver.implicitly_wait(5)

    def tearDown(self):
        print("https://saucelabs.com/jobs/%s \n" % self.driver.session_id)
        try:
            if sys.exc_info() == (None, None, None):
                sauce_client.jobs.update_job(self.driver.session_id, passed=True)
            else:
                sauce_client.jobs.update_job(self.driver.session_id, passed=False)
        finally:
            self.driver.quit()

    def test_sauce(self):

        print("hello")
        self.driver.get('http://curry.aca.uw.edu:8001/filter/')
        test = self.driver.find_element_by_id('test')
        self.assertEqual(test.text,"Hello World!")


    # User can browse all spaces on campus for a place to eat without knowing anything about the space - https://jira.cac.washington.edu/browse/SCOUT-1

    # User can search for a place to eat on campus by entering the name of the place as a search filter - https://jira.cac.washington.edu/browse/SCOUT-2

    # User can find a place to eat on campus by viewing pins on a map which represent spots that meet the criteria of "open now" and are either near the user's current location or are centered around a central point on campus. https://jira.cac.washington.edu/browse/SCOUT-4

    # User can find a place to eat by searching for places that are 'open specific hours' https://jira.cac.washington.edu/browse/SCOUT-5

    # User can bring up a list of the most popular places to eat by clicking on a link in the app https://jira.cac.washington.edu/browse/SCOUT-6

    # User can bring up a list of the places that serve coffee based on their current location by clicking a link https://jira.cac.washington.edu/browse/SCOUT-7

    # User can bring up a list of places that serve breakfast by clicking a link in the app
