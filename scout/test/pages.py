#!/usr/bin/python

from selenium import webdriver
import time
import unittest

class BasePage(object):
    def __init__(self, driver):
        self.driver = driver

    @property
    def homeLogo(self):
        return self.driver.find_element_by_id('link_home')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

    def click_home(self):
        self.homeLogo.click()
        self._become_home()

    def click_discovertab(self):
        self.discoverTab.click()
        self._become_home()

    def click_placestab(self):
        self.placesTab.click()
        self._become_places()

    def _become(self):
        self.__class__ = HomePage

    def _become_places(self):
        self.__class__ = PlacesPage

    def _become_detail(self):
        self.__class__ = DetailsPage

    def _become_filter(self):
        self.__class__ = FilterPage

class HomePage(BasePage):

    @property
    def openNearbyList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='open']//li[@class='scout-spot-list-discover']")

    @property
    def coffeeList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='coffee']//li[@class='scout-spot-list-discover']")

    @property
    def breakfastList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='breakfast']//li[@class='scout-spot-list-discover']")

    @property
    def lateList(self):
        return self.driver.find_elements_by_xpath(
           "//div[@id='late']//li[@class='scout-spot-list-discover']")

    @property
    def couponList(self):
        return self.driver.find_elements_by_xpath(
           "//div[@id='coupon']//li[@class='scout-spot-list-discover']")

    @property
    def openNearbyView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='open']//a[@class='scout-spot-discover-action']")

    @property
    def coffeeView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='coffee']//a[@class='scout-spot-discover-action']")

    @property
    def breakfastView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='breakfast']//a[@class='scout-spot-discover-action']")

    @property
    def lateView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='late']//a[@class='scout-spot-discover-action']")

    @property
    def couponView(self):
        return self.driver.find_element_by_xpath(
            "//div[@id='coupon']//a[@class='scout-spot-discover-action']")

    def click_place(self, food_type='open', num=0):
        food_types = {
            'open': self.openNearbyList,
            'coffee': self.coffeeList,
            'breakfast': self.breakfastList,
            'late': self.lateList,
            'coupon': self.couponList
        }
        place_list = food_types[food_type]
        try:
            button = place_list[num]
        except IndexError:
            raise PlaceIndexError(num, place_list)

        button.click()
        self._become_detail()
        # return DetailPage(self.driver)

    def click_results(self, food='open'):
        linkLists = {
            'open': self.openNearbyView,
            'coffee': self.coffeeView,
            'breakfast': self.breakfastView,
            'late': self.lateView,
            'coupon': self.couponView
        }
        temp = linkLists.get(food)
        temp.click()
        self._become_places()

class PlaceIndexError(IndexError):
    def __init__(self, index, places):
        length = len(places)
        out = 'Place index %s out of range: %s' %(index, length)
        super(PlaceIndexError, self).__init__(out)

class PlacesPage(BasePage):

    @property
    def filterReset(self):
        return self.driver.find_element_by_id('reset_filter')

    @property
    def filterResults(self):
        return self.driver.find_element_by_id('link_filter')

    @property
    def filterBy(self):
        return self.driver.find_element_by_class_name('scout-filter-results-text')

    @property
    def placesCount(self):
        return self.driver.find_element_by_class_name('scout-filter-results-count')

    @property
    def placesList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@class='scout-list-container']/ol[@id='scout_list']/li")

    def placesName(self, num=0):
        return self.driver.find_element_by_xpath(
            "//div[@class='scout-list-container']/ol[@id='scout_list']\
            /li[@id=%s]/a[@class='clearfix']/div[@class='scout-spot-content']\
            /div/h3[@class='scout-spot-name']" % str(num))

    def reset_filters(self):
        self.filterReset.click()

    def get_filters(self):
        self.filterResults.click()
        self._become_filter()

    def click_place(self, num=0):
        try:
            self.placesList[num].click()
        except IndexError:
                raise PlaceIndexError(num, self.placesList)
        else:
            self._become_detail()

class FilterPage(BasePage):

    @property
    def resetButton(self):
        return self.driver.find_element_by_id('reset_button')

    @property
    def viewButton(self):
        return self.driver.find_element_by_id('run_search')

    @property
    def seattleBox(self):
        return self.driver.find_element_by_name('seattle')

    @property
    def openNowBox(self):
        return self.driver.find_element_by_name('open_now')

    def click_seattleBox(self):
        self.seattleBox.click()

    def click_openNow(self):
        self.openNowBox.click()

    def search(self):
        self.viewButton.click()
        self._become_places()

    def reset(self):
        self.resetButton.click()

class DetailsPage(BasePage):

    @property
    def foodName(self):
        return self.driver.find_element_by_class_name('scout-spot-name')

    @property
    def foodCuisines(self):
        return self.driver.find_element_by_class_name('scout-spot-cuisine')

    @property
    def foodType(self):
        return self.driver.find_element_by_class_name('scout-spot-type')

    @property
    def openStatus(self):
        return self.driver.find_element_by_class_name('scout-spot-status')

if __name__ == '__main__':
    from selenium.webdriver import Firefox, Chrome
    d = Chrome()
    d.get('http://localhost:8001/')
    page = HomePage(d)
