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

    def setUp(self):

        self.desired_cap = {
            "name": "UI Tests",
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


    """
    Let's test the shared location functionality of the app. The app should ask
    for the user's location. If the user says no, or just closes the location
    dialog, then we'll set their default location to center of the fountain.
    """
    def test_user_location(self):

        print("hello")
        self.driver.get('http://curry.aca.uw.edu:8001/filter/')
        test = self.driver.find_element_by_id('test')
        self.assertEqual(test.text,"Hello World!")
