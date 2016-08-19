#!/usr/bin/python
"""
Tests the contents of each page, making sure the
necessary selectors are present
"""

import bs4
from scout.test import ScoutTestCase
from scout.dao.space import get_spot_list
baseUrl = '/seattle/'


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
        bs = self.get_soup(baseUrl)
        self.assertOneExists(bs, "#page_discover")

    def test_food_content(self):
        """SCOUT-53 Test that the content on the food page is correct"""
        bs = self.get_soup(baseUrl + 'food/')
        self.assertOneExists(bs, "#page_food")

    def test_detail_content(self):
        """SCOUT-58 Test that the content on the detail page is correct"""
        spot_list = get_spot_list(app_type='food')
        temp_id = str(spot_list[0].spot_id)
        bs = self.get_soup(baseUrl + 'food/' + temp_id)
        # grabbing the id number from the URL (ex. /detail/5106/)
        expUrl = 'page_' + temp_id
        # grabbing the actual id on the page
        scoutContent = bs.select('.scout-content')
        # asserting that they are equal
        self.assertEqual(expUrl, scoutContent[0].get('id'))

    def test_filter_content(self):
        """SCOUT-54 Test that the content on the filter page is correct"""
        bs = self.get_soup(baseUrl + 'food/filter/')
        self.assertOneExists(bs, "#page_filter")
