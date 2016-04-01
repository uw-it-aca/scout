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
useSauce = False

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

    def checkHref(self, exp, loc, response):
        bs = bs4.BeautifulSoup(response.content, "html5lib")
        temp = bs.select(loc)
        self.assertEqual(temp[0].get('href'), exp)
        return self.client.get(temp[0].get('href'))

    # @wd.parallel.multiply
    def test_main_nav(self):
        """Goes from page to page and verifies that URLs are correct on
        each page """
        self.updateSauceName('Pageflow: Main Navigation')
        response = self.client.get('/')
        dest = self.checkHref('/food/', '#link_food', response)
        dest = self.checkHref('/filter/','#link_filter', dest)
        dest = self.checkHref('/', '#link_discover', dest)
        dest = self.checkHref('/', '#link_home', dest)

    # @wd.parallel.multiply
    def test_home_exists(self):
        """Test that the home page results in a 200"""
        self.updateSauceName('Pageflow: Home Filter 200')
        # Home Page
        self.assertUrlStatus('/', 200)

    # @wd.parallel.multiply
    def test_food_exists(self):
        """Test that the food page results in a 200"""
        self.updateSauceName('Pageflow: Food Filter 200')
        self.assertUrlStatus('/food/', 200)

    # @wd.parallel.multiply
    def test_filter_exists(self):
        """Test that the filter page results in a 200"""
        self.updateSauceName('Pageflow: Filter URL 200')
        self.assertUrlStatus('/filter/', 200)

    def returnSoup(self, url):
        response = self.client.get(url)
        return bs4.BeautifulSoup(response.content, "html5lib")

    # @wd.parallel.multiply
    def test_home_content(self):
        """Test that there is at least one place listed on the home page"""
        self.updateSauceName('Pageflow: Home Content')
        bs = self.returnSoup('/')
        checkId = bs.select('#page_discover')
        self.assertGreater(len(checkId), 0)
        print bs
        places = bs.select('.scout-spot-name')
        self.assertGreater(len(places), 0)

    # @wd.parallel.multiply
    def test_food_content(self):
        """Test that the content on the food page is correct"""
        self.updateSauceName('Pageflow: Food Content')
        bs = self.returnSoup('/food/')
        checkId = bs.select('#page_food')
        self.assertGreater(len(checkId), 0)
        filterButtons = bs.select('.scout-filter-results-action')
        self.assertEqual(filterButtons[0].getText(), 'Filter results')
        self.assertEqual(filterButtons[1].getText(), 'Reset filter')

    # @wd.parallel.multiply
    def test_detail_content(self):
        """Test that the content on the detail page is correct"""
        self.updateSauceName('Pageflow: Detail Content')
        bs = self.returnSoup('/food/')
        places = bs.select('ol li a')
        # clicking the first place on the list
        tempHref = places[0].get('href')
        bs = self.returnSoup(tempHref)
        spotName = bs.select('.scout-spot-name')
        tempUrl = tempHref.split('/')
        scoutContent = bs.select('.scout-content')
        self.assertEqual('page_' + tempUrl[len(tempUrl) - 2], scoutContent[0].get('id'))

    # @wd.parallel.multiply
    def test_filter_content(self):
        """Test that the content on the filter page is correct"""
        self.updateSauceName('Pageflow: Filter Content')
        bs = self.returnSoup('/filter/')
        checkId = bs.select('#page_filter')
        self.assertGreater(len(checkId), 0)
        legends = bs.select('legend')
        self.assertEqual(legends[0].text, 'Campus')

    # @wd.parallel.multiply
    def test_bad_detailURL(self):
        """Ensure a nonexistant space results in a 404 status code"""
        self.updateSauceName('Pageflow: Nonexistant Space Details Page')
        self.assertUrlStatus('/detail/12345679', 404)

    # uncomment for debugging
    # @unittest.expectedFailure
    # @wd.parallel.multiply
    def test_bad_homeURL(self):
        """Test an invalid URL and see if it results in a 404"""
        self.updateSauceName('Pageflow: Bad Home URL')
        # Bad URL
        self.assertUrlStatus('/LSFDLK/', 404)

    # uncomment for debugging
    # @unittest.expectedFailure
    # @wd.parallel.multiply
    def test_redirect_URLs(self):
        """Test URLs that are meant to redirect(301)"""
        self.updateSauceName('Pageflow: Redirecting URLs')
        # Test some other potential url's that should be able to redirect
        self.assertUrlStatus('/food', 301)
        self.assertUrlStatus('/filter', 301)
