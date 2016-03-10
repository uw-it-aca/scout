"""
A simple functional headless UI test with pyvirtualdisplay and selenium
Links and URLS
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

    baseurl = 'http://localhost:8001/'

    def setUp(self):

        self.desired_cap = {
            'platform': "Mac OS X 10.9",
            'browserName': "chrome",
            'version': "31",
            'tags': ["Pageflow", "Kevin"] 
        }

        self.driver = webdriver.Remote(
            command_executor='http://'+USERNAME+':'+ACCESS_KEY+'@ondemand.saucelabs.com:80/wd/hub',
            desired_capabilities=self.desired_cap)

        self.driver.implicitly_wait(20)

    # tests to see if filter url is navigable
    def test_sauce(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Test Sauce")

        self.go_url('filter/')
        #self.driver.get(self.baseurl + 'filter/')
        test = self.driver.find_element_by_id('test')
        self.assertEqual(test.text,"Hello World!")

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

    # Travels from discover - food - home
    def test_main_navigation(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Navigate Path #1")

        self.driver.get(self.baseurl)
        self.click_discover()
        self.click_food()
        self.click_home()

    # Travels through food - filter - home
    def test_food(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Navigate Path #2")

        self.go_url()
        #self.driver.get(self.baseurl)
        self.click_food();
        self.click_filter();
        self.click_home()

    # checks to see if you are on a discover/food tab if you can click the tab (you shouldn't be able to)
    def test_clickable(self):

        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Clickable")

        self.go_url()
        self.click_food()
        temp = self.driver.current_url
        self.click_food()
        self.assertEqual(temp, self.driver.current_url)
        self.click_discover()
        temp = self.driver.current_url
        self.click_discover()
        self.assertEqual(temp, self.driver.current_url)

    # goes from home - food - filter - reset - filter - search - resetFilters - details1 - localhost/food - filter 
    # localhost/discover - home
    def test_everything(self):
        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Everything")

        self.driver.get(self.baseurl)
        self.click_food()
        self.click_filter()
        self.driver.find_element_by_id('reset_button').click()
        self.click_filter()
        self.driver.find_element_by_id('run_search').click()
        self.click_filter()
        self.driver.find_element_by_id('1').click()
        self.click_home()
        self.assertEqual(self.baseurl, self.driver.current_url)
        #all pages can be reached by URL

    # Sees if the following pages are reachable by URL
    def test_URL(self):
        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: URL")
        #HomePage
        self.driver.get(self.baseurl)
        #FoodPage
        self.driver.get(self.baseurl + 'food/')
        #Discover Page
        self.driver.get(self.baseurl + 'discover/')
        #Filter Page
        self.driver.get(self.baseurl + 'filter/')

        #Test some other potential url's that should be able to redirect
        self.driver.get(self.baseurl + 'food') # hopefully should redirect... missing the last slash
        self.click_filter() # checking to see if on food
        self.driver.get(self.baseurl + 'discover') # hopefully should redirect... missing the last slash
        self.driver.find_element_by_id('1').click() #should be able to find a place with element 1

    def tearDown(self):
        print("https://saucelabs.com/jobs/%s \n" % self.driver.session_id)
        try:
            if sys.exc_info() == (None, None, None):
                sauce_client.jobs.update_job(self.driver.session_id, passed=True)
            else:
                sauce_client.jobs.update_job(self.driver.session_id, passed=False)
        finally:
            self.driver.quit()

    # User can browse all spaces on campus for a place to eat without knowing anything about the space - https://jira.cac.washington.edu/browse/SCOUT-1

    # User can search for a place to eat on campus by entering the name of the place as a search filter - https://jira.cac.washington.edu/browse/SCOUT-2

    # User can find a place to eat on campus by viewing pins on a map which represent spots that meet the criteria of "open now" and are either near the user's current location or are centered around a central point on campus. https://jira.cac.washington.edu/browse/SCOUT-4

    # User can find a place to eat by searching for places that are 'open specific hours' https://jira.cac.washington.edu/browse/SCOUT-5

    # User can bring up a list of the most popular places to eat by clicking on a link in the app https://jira.cac.washington.edu/browse/SCOUT-6

    # User can bring up a list of the places that serve coffee based on their current location by clicking a link https://jira.cac.washington.edu/browse/SCOUT-7

    # User can bring up a list of places that serve breakfast by clicking a link in the app
