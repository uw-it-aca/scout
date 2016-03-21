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

class WireframeTest(LiveServerTestCase):

    baseurl = 'http://localhost:8001/'
    
    def setUp(self):

        self.desired_cap = {
            'platform': "Mac OS X 10.9",
            'browserName': "chrome",
            'version': "31",
            'tags': ["wireframe"] 
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

    # SCOUT-8, testing to see if user can bring up list of b-fast places by clicking view more results
    def test_breakfast(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="Wireframe: Breakfast")
        self.go_url()
        tryit = self.driver.find_element_by_xpath("//div[@id='breakfast']/div[@class='scout-card scout-discover-content']/ol/li[5]/a[@class='scout-spot-discover-action']/span[@class='scout-spot-action-text']")
        tryit.click()
        tester = self.driver.find_element_by_class_name("scout-filter-results-text")
        self.assertEqual(tester.text, "Open Period")
