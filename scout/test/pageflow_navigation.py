"""
A simple functional headless UI test with pyvirtualdisplay and selenium
Links and URLS
"""

import os, bs4
import sys

from selenium import webdriver
from django.test import LiveServerTestCase
from django.test import Client
from django.conf import settings

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

from sauceclient import SauceClient
sauce_client = SauceClient(USERNAME, ACCESS_KEY)

class PageflowNavigationTest(LiveServerTestCase):

    client = Client()
    baseurl = 'http://localhost:8001/'
    desired_cap = {
        'platform': "Mac OS X 10.9",
        'browserName': "chrome",
        'version': "31",
        'tags': ["pageflow"] 
    }
    
    def setUp(self):

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

    def test_main_navigation(self):

        """Travels from discover - food - filter - details - home
            SCOUT-43                                              """

        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: Navigate Path #1")

        self.go_url('discover') 
        # i'll use this later
        tempSoup = bs4.BeautifulSoup(self.driver.page_source, "html5lib")
        self.click_food()
        temp = self.driver.current_url

        # verifying url is correct
        self.assertEqual(temp, self.baseurl + 'food/') 
        clickable = self.driver.find_element_by_id('link_food')
        # checking to see if the tab is disabled (clicking-wise)
        self.assertEqual(clickable.get_attribute('disabled'), 'true') 

        check1 = self.driver.find_elements_by_class_name('scout-filter-results-action')
        self.assertEqual(check1[0].text, "Filter results") 
        self.assertEqual(check1[1].text, "Reset filter")  

        self.click_filter()
        # verifying url is correct
        self.assertEqual(self.driver.current_url, self.baseurl + 'filter/')
        legends = self.driver.find_elements_by_tag_name('Legend') 
        self.assertEqual(legends[0].text, 'CAMPUS')

        self.click_food()
        places = self.driver.find_elements_by_class_name('scout-spot-name')
        places[0].click() # clicking the first place on the list
        spotName = self.driver.find_element_by_class_name('scout-spot-name').text
        self.assertEqual(spotName, 'Truck of Food')

        self.click_home()
        # verifying url is correct
        self.assertEqual(self.baseurl, self.driver.current_url)

        clickable = self.driver.find_element_by_id('link_discover')
        # checking to see if the tab is disabled (clicking-wise)
        self.assertEqual(clickable.get_attribute('disabled'), 'true') 

        self.click_home()
        tempSoup2 = bs4.BeautifulSoup(self.driver.page_source, "html5lib")
        # seeing if discover and home html are the same page
        self.assertEqual(tempSoup.select('div > span'), tempSoup2.select('div > span'))
        
    def clientUrlStatus(self, urlsuffix=''):
        res = self.client.get(urlsuffix)
        return res.status_code

    # Sees if the following pages are reachable/unreachable by URL
    def test_URL(self):
        sauce_client.jobs.update_job(self.driver.session_id, name="Pageflow: URL")

        # Home Page
        self.assertEqual(self.clientUrlStatus(), 200)
        
        # FoodPage
        self.assertEqual(self.clientUrlStatus('/food/'), 200)
        
        # Discover Page
        self.assertEqual(self.clientUrlStatus('/discover/'), 200)

        # Filter Page
        self.assertEqual(self.clientUrlStatus('/filter/'), 200)

        # Bad URL (for details)
        try:
            self.clientUrlStatus('/detail/404')
        except Exception as ex:
            self.assertIn('404', str(ex))
        else:
            self.fail('Didn\'t get 404 for /detail/404')

        # Bad URL
        self.assertEqual(self.clientUrlStatus('/LSFDLK/'), 500) # or should it be a 404... hmm

        # Test some other potential url's that should be able to redirect
        self.assertEqual(self.clientUrlStatus('/food'), 302)
        self.assertEqual(self.clientUrlStatus('/discover'), 302)

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
