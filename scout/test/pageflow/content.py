#!/usr/bin/python
"""
Tests the contents of each page, making sure the
necessary selectors are present
"""

import bs4
from scout.test import ScoutTestCase


class ContentTest(ScoutTestCase):
    """Content test set for scout, (page id's)"""

    @classmethod
    def setUpClass(cls):
        super(ContentTest, cls).setUpClass()
        cls.soups = {}

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

    def assertOneExists(self, soup, selector):
        elements = soup.select(selector)
        num = len(elements)
        self.assertEqual(num, 1, 'Expected 1 of %s, got %s' % (selector, num))

    def test_home_content(self):
        """SCOUT-52 Test that the content on the home page is correct"""
        bs = self.get_soup('')
        self.assertOneExists(bs, "#page_discover")

    def test_food_content(self):
        """SCOUT-53 Test that the content on the food page is correct"""
        bs = self.get_soup('/food/')
        self.assertOneExists(bs, "#page_food")

    def test_detail_content(self):
        """SCOUT-58 Test that the content on the detail page is correct"""
        bs = self.get_soup('/food/')
        places = bs.select('ol li a')
        # basically clicking the first place on the list
        tempHref = places[0].get('href')
        bs = self.get_soup(tempHref)
        tempUrl = tempHref.split('/')
        # grabbing the id number from the URL (ex. /detail/5106/)
        expUrl = 'page_' + tempUrl[len(tempUrl) - 2]
        # grabbing the actual id on the page
        scoutContent = bs.select('.scout-content')
        # asserting that they are equal
        self.assertEqual(expUrl, scoutContent[0].get('id'))

    def test_filter_content(self):
        """SCOUT-54 Test that the content on the filter page is correct"""
        bs = self.get_soup('/food/filter/')
        self.assertOneExists(bs, "#page_filter")
