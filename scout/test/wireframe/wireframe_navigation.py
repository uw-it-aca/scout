"""
A simple functional headless UI test with pyvirtualdisplay and selenium
"""

import os
import sys
from pages import pages

from selenium import webdriver
from django.test import LiveServerTestCase
from django.conf import settings

USERNAME = getattr(settings, 'SAUCE_USERNAME', False)
ACCESS_KEY = getattr(settings, 'SAUCE_ACCESS_KEY', False)

from sauceclient import SauceClient
sauce_client = SauceClient(USERNAME, ACCESS_KEY)

class WireframeTest(LiveServerTestCase):

    baseurl = 'http://localhost:8001'

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

    def test_aa(self):
        self.go_url('/food/')
        places_page = pages.PlacesPage(self.driver)
        places_page.click_place(2)

    def test_aHome(self):
        self.go_url('/')
        home_page = pages.HomePage(self.driver)
        home_page.clickResults('breakfast')

    def test_ahelp(self):
        self.go_url('/detail/3')
        detail_page = pages.DetailsPage(self.driver)
        self.assertEqual(detail_page.openStatus.text, "OPEN NOW")

    # SCOUT-8, testing to see if user can bring up list of b-fast places by clicking view more results
    def test_breakfast(self):

        self.updateSauceName("Wireframe: Breakfast")
        self.go_url()
        tryit = self.driver.find_element_by_xpath("//div[@id='breakfast']/div[@class='scout-card scout-discover-content']/ol/li[5]/a[@class='scout-spot-discover-action']/span[@class='scout-spot-action-text']")
        tryit.click()
        tester = self.driver.find_element_by_class_name("scout-filter-results-text")
        self.assertEqual(tester.text, "Open Period")
        results = self.driver.find_element_by_class_name("scout-filter-results-count")
        self.assertEqual(results.text, "4")

    # testing to see if user can bring up list of coupon places by clicking view more results
    def test_coupons(self):

        self.updateSauceName("Wireframe: Coupons")
        self.go_url()
        tryit = self.driver.find_element_by_xpath("//div[@id='coupon']/div[@class='scout-card scout-discover-content']/ol/li[3]/a[@class='scout-spot-discover-action']/span[@class='scout-spot-action-text']")
        tryit.click()
        results = self.driver.find_element_by_class_name("scout-filter-results-count")
        self.assertEqual(results.text, "2")

    # testing to see if user can click on a place and then see more details from the home page
    def test_details(self):

        self.updateSauceName("Wireframe: Details")
        self.go_url()
        tryit = self.driver.find_element_by_xpath("//div[@id='open']/div[@class='scout-card scout-discover-content']/ol/li[1]/a[@class='clearfix']/span[@class='scout-spot-name']")
        tryit.click()
        name = self.driver.find_element_by_class_name("scout-spot-name")
        food_type = self.driver.find_element_by_class_name("scout-spot-type")
        self.assertEqual(name.text, "Banh & Naan, Husky Den")
        self.assertEqual(food_type.text, "FOOD COURT")

    # testing to see if user can click on a place and then see more details from the "places" page
    def test_details2(self):

        self.updateSauceName("Wireframe: Details2")
        self.go_url()
        self.click_food()
        tryit = self.driver.find_element_by_xpath("//div[@id='content']/div[@class='scout-list-container']/ol[@id='scout_list']/li[@id='3']/a[@class='clearfix']/div[@class='scout-spot-content']/div/h3[@class='scout-spot-name']")
        tryit.click()
        name = self.driver.find_element_by_class_name("scout-spot-name")
        food_type = self.driver.find_element_by_class_name("scout-spot-type")
        self.assertEqual(name.text, "Truck of Food")
        self.assertEqual(food_type.text, "FOOD TRUCK")

    # testing to see if it can go to the correct external url
    def test_getWebsite(self):

        self.updateSauceName("Wireframe: Get Website")
        self.go_url()
        self.click_food()
        tryit = self.driver.find_element_by_xpath("//div[@id='content']/div[@class='scout-list-container']/ol[@id='scout_list']/li[@id='3']/a[@class='clearfix']/div[@class='scout-spot-content']/div/h3[@class='scout-spot-name']")
        tryit.click()
        website = self.driver.find_elements_by_class_name("scout-spot-action-text")
        website[1].click()
        self.driver.implicitly_wait(2)
        # wait... is this the best way to wait?
        self.assertEqual(self.driver.current_url, website[1].text)
