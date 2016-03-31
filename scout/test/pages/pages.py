#!/usr/bin/python

from selenium import webdriver
import unittest

class BasePage(object):
    def __init__(self, driver):
        self.driver = driver

class PlacesPage(BasePage):

    @property
    def filterReset(self):
        return self.driver.find_element_by_id('reset_filter')

    @property
    def filterResults(self):
        return self.driver.find_element_by_id('link_filter')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

    @property
    def placesList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@class='scout-list-container']/ol[@id='scout_list']/li")

    def reset_filters(self):
        self.filterReset.click()

    def get_filters(self):
        self.filterResults.click()
        return FilterPage(self.driver)

    def click_discoverTab(self):
        self.discoverTab.click()
        return HomePage(self.driver)

    def click_placesTab(self):
        self.placesTab.click()

    def click_place(self, num=0):
        try:
            self.placesList[num].click()
        except IndexError:
            assert False, ('Index ' + str(num) + ' is out of range: ' + str(len(self.placesList))) # is there a better way?
        else:
            print('it')
