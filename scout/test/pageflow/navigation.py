#!/usr/bin/python
"""
Tests the general navigation of the application
Testing the flow between pages through links
"""

import bs4
from scout.test import ScoutTestCase

baseUrl = '/'
foodUrl = baseUrl + 'food/'
studyUrl = baseUrl + 'study/'
techUrl = baseUrl + 'tech/'

urls = {
    'home': baseUrl,
    'food': foodUrl,
    'study': studyUrl,
    'tech': techUrl,
    'food_filter': foodUrl + 'filter/',
    'study_filter': studyUrl + 'filter/',
    'tech_filter': techUrl + 'filter/',
    'food_detail': foodUrl + '1/',
}

tests = {
    'home': ('food', 'study', 'tech'),
    'food': ('home', 'study', 'tech', 'food_filter'),
    'study': ('home', 'food', 'tech', 'study_filter'),
    'tech': ('home', 'food', 'study', 'tech_filter'),
    'food_filter': ('home', 'food', 'study', 'tech'),
    'study_filter': ('home', 'food', 'study', 'tech'),
    'tech_filter': ('home', 'food', 'study', 'tech'),
    'food_detail': ('home', 'food', 'study', 'tech'),
}

def _makeTestFunc(start, end):
    """Returns a function that tests the navigation between two pages"""

    def _testFunc(self):
        page = self.get_soup(urls[start])
        self.assertTrue(self.checkLinkExists(page, urls[end]))

    _testFunc.__name__ = 'test_%s_to_%s' %(start, end)
    _testFunc.__doc__ = 'Assert that %s has a link to %s' %(start, end)
    return _testFunc

def _makeTestFooterFunc(start):

    def _testFunc(self):
        self.check_footer_links_at_path(urls[start])

    _testFunc.__name__ = "test_%s_footer_links" %(start)
    _testFunc.__doc__ = "Assert that the %s page contains the footer links" %(start)
    return _testFunc


class MainNavigationTest(ScoutTestCase):
    """Navigation test set for scout"""

    @classmethod
    def setUpClass(cls):
        super(MainNavigationTest, cls).setUpClass()
        cls.soups = {}

    for page, links in tests.items():
        testFooter = _makeTestFooterFunc(page)
        testFooterName = testFooter.__name__
        vars()[testFooterName] = testFooter
        for link in links:
            testLink = _makeTestFunc(page, link)
            testLinkName = testLink.__name__
            vars()[testLinkName] = testLink

    del page, link, links, testLink, testLinkName, testFooter, testFooterName


    def checkLinkExists(self, soup, link):
        return bool(soup.find('a', href=link))

    def checkHrefBySelector(self, exp, selector, soup):
        """Given a selector, ensure that the first link found with that
        selector has an href matching 'exp'., returns the response
        of the href."""
        link = soup.select(selector)[0]
        self.checkHref(link, exp)

    def checkHref(self, link, expectedLoc):
        """Given a link, ensure that its href is the same as expectedLoc"""
        linkHref = link.get('href')
        self.assertEqual(linkHref, expectedLoc)

    def get_soup(self, page):
        """Returns a soup object given a path, if there is no soup for the
        particular suffix, then it will create it and remember it"""
        if page in self.soups:
            return self.soups[page]
        else:
            response = self.client.get(page)
            soup = bs4.BeautifulSoup(response.content, "html5lib")
            self.soups[page] = soup
            return soup

    def check_footer_links_at_path(self, path):
        """Checks the footer links at the given path"""
        soup = self.get_soup(path)
        self.check_footer_links(soup)

    def check_footer_links(self, soup):
        """Checks the footer links at the given soup"""
        footerLinks = soup.select('div#footer a')
        privacyLink, termsLink = footerLinks
        self.assertEqual(
            privacyLink.get('href'),
            'http://www.washington.edu/online/privacy/'
        )
        self.assertEqual(
            termsLink.get('href'),
            'http://www.washington.edu/online/terms/'
        )

    '''
    def test_home_to_food(self):
        """SCOUT-67 Tests the places tab link on the home page"""
        response = self.get_soup('/')
        self.checkHrefBySelector('/food/', '#link_food', response)

    def test_home_to_home(self):
        """SCOUT-61 Tests the home logo link on the home page"""
        response = self.get_soup('/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_food_to_home(self):
        """SCOUT-59 Tests the home logo link on the food page"""
        response = self.get_soup('/food/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_food_to_filter(self):
        """SCOUT-68 Tests the filter link on the food page"""
        response = self.get_soup('/food/')
        self.checkHrefBySelector('/food/filter/', '#link_filter', response)

    def test_filter_to_home(self):
        """SCOUT-60 Tests the home logo link on the filter page"""
        response = self.get_soup('/food/filter/')
        self.checkHrefBySelector('/', '#link_home', response)

    def test_filter_to_food(self):
        """SCOUT-62 Tests the food tab link on the filter page"""
        response = self.get_soup('/food/filter/')
        self.checkHrefBySelector('/food/', '#link_food', response)

    def test_footer_links_home(self):
        """SCOUT-63 Checks the privacy/terms on the home page"""
        self.check_footer_links_at_path('/')

    def test_footer_links_food(self):
        """SCOUT-64 Checks the privacy/terms on the places page"""
        self.check_footer_links_at_path('/food/')

    def test_footer_links_filter(self):
        """SCOUT-65 Checks the privacy/terms on the filter page"""
        self.check_footer_links_at_path('/food/filter/')

    def test_footer_links_detail(self):
        """SCOUT-66 Checks the privacy/terms on the detail page"""
        self.check_footer_links_at_path('/food/2/')
    '''
