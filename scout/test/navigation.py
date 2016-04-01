#!/usr/bin/python
"""
A simple functional headless UI test with pyvirtualdisplay and selenium
Links and URLS
"""

import bs4
import sys
import unittest
import copy

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


class NavigationTest(LiveServerTestCase):
    """Navigation test set for scout"""

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

        """
        desired_cap_list = []

        safari = copy.copy(webdriver.DesiredCapabilities.SAFARI)
        safari.update({
            'platform': 'OS X 10.11',
            'name': 'safari',
            'version': '9.0',
            'build': 'story/food'
        })

        desired_cap_list.append(safari)

        sauceUrl = 'http://%s:%s@ondemand.saucelabs.com:80/wd/hub'\
            %(USERNAME, ACCESS_KEY)
        self.drivers = wd.parallel.Remote(
           desired_capabilities=desired_cap_list,
           command_executor=sauceUrl
        )
        """
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

    def click_id(self, elid):
        """Finds and clicks the given id"""
        self.driver.find_element_by_id(elid).click()

    def go_url(self, urlsuffix=''):
        """Has the driver go to the given URL"""
        self.driver.get(self.baseurl + urlsuffix)

    def click_places(self):
        self.click_id('link_food')

    def click_discover(self):
        self.click_id('link_discover')

    def click_home(self):
        self.click_id('link_home')

    def click_filter(self):
        self.click_id('link_filter')

    def clientUrlStatus(self, urlsuffix=''):
        """Returns the status code of the given URL"""
        res = self.client.get(urlsuffix)
        return res.status_code

    def assertLocation(self, exploc):
        """Checks to see if the current url matches the given intended URL"""
        curloc = self.driver.current_url
        if not exploc.startswith('http'):
            exploc = self.baseurl + exploc
        self.assertEqual(curloc, exploc)

    def assertUrlStatus(self, urlsuffix='', code=200):
        """Checks to see if the status code of the given URL matches the
        given status code"""
        self.assertEqual(self.clientUrlStatus(urlsuffix), code)

    def updateSauceName(self, name):
        """Sets the saucelabs job name"""
        if self.useSauce:
            sauce_client.jobs.update_job(self.driver.session_id, name=name)

    # @wd.parallel.multiply
    def test_main_nav(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        self.updateSauceName('Pageflow: Main Navigation')
        self.go_url()
        self.click_places()
        # Locate space list elements
        firstplace = self.driver.find_element_by_css_selector(
            'ol#scout_list li a')
        # clicking the first place on the list
        expLoc = firstplace.get_attribute('href')
        firstplace.click()
        self.assertLocation(expLoc)
        self.click_places()
        self.assertLocation('/food/')
        self.click_filter()
        self.assertLocation('/filter/')
        self.click_home()
        self.assertLocation('/')

    # @wd.parallel.multiply
    def test_home_content(self):
        """Test that there is at least one place listed on the home page"""
        self.updateSauceName('Pageflow: Home Content')
        self.go_url('/')
        self.driver.find_element_by_id('page_discover')
        places = self.driver.find_elements_by_class_name('scout-spot-name')
        self.assertGreater(len(places), 0)

    # @wd.parallel.multiply
    def test_food_content(self):
        """Test that the content on the food page is correct"""
        self.updateSauceName('Pageflow: Food Content')
        self.go_url('/food/')
        self.driver.find_element_by_id('page_food')
        filterButtons = self.driver.find_elements_by_class_name(
            'scout-filter-results-action')
        self.assertEqual(filterButtons[0].text, 'Filter results')
        self.assertEqual(filterButtons[1].text, 'Reset filter')

    # @wd.parallel.multiply
    def test_detail_content(self):
        """Test that the content on the detail page is correct"""
        self.updateSauceName('Pageflow: Detail Content')
        self.go_url('/food/')
        places = self.driver.find_elements_by_class_name('scout-spot-name')
        # clicking the first place on the list
        places[0].click()
        spotName = self.driver.find_element_by_class_name('scout-spot-name')
        tempUrl = self.driver.current_url.split('/')
        scoutContent = self.driver.find_element_by_class_name('scout-content')
        self.assertEqual('page_' + tempUrl[len(tempUrl) - 2], scoutContent.get_attribute('id'))

    # @wd.parallel.multiply
    def test_filter_content(self):
        """Test that the content on the filter page is correct"""
        self.updateSauceName('Pageflow: Filter Content')
        self.go_url('/filter/')
        self.driver.find_element_by_id('page_filter')
        legends = self.driver.find_elements_by_tag_name('Legend')
        self.assertEqual(legends[0].text, 'CAMPUS')

    # @wd.parallel.multiply
    def test_foodtab_notclickable(self):
        """Test that once on the food/places page, the places tab
        isn't clickable"""
        self.updateSauceName('Pageflow: Food Tab Not-Clickable')
        self.go_url('/food/')
        clickable = self.driver.find_element_by_id('link_food')
        self.assertEqual(clickable.get_attribute('disabled'), 'true')

    # @wd.parallel.multiply
    def test_discovertab_notclickable(self):
        """Test that once on the discover/home page, the discover tab
        isn't clickable"""
        self.updateSauceName('Pageflow: Discover Tab Not-Clickable')
        self.go_url('/')
        clickable = self.driver.find_element_by_id('link_discover')
        self.assertEqual(clickable.get_attribute('disabled'), 'true')
