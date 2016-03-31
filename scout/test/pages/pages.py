#!/usr/bin/python

from selenium import webdriver
import unittest

class BasePage(object):
    def __init__(self, driver):
        self.driver = driver

class HomePage(BasePage):

    @property
    def homeLogo(self):
        return self.driver.find_element_by_id('link_home')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

    @property
    def openNearbyList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='open']/div[@class='scout-card scout-discover-content']/ol/li[@class='scout-spot-list-discover']")

    @property
    def coffeeList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='coffee']/div[@class='scout-card scout-discover-content']/ol/li[@class='scout-spot-list-discover']")

    @property
    def breakfastList(self):
        return self.driver.find_elements_by_xpath(
            "/div[@id='breakfast']/div[@class='scout-card scout-discover-content']/ol/li[@class='scout-spot-list-discover']")

    @property
    def lateList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='late']/div[@class='scout-card scout-discover-content']/ol/li[@class='scout-spot-list-discover']")

    @property
    def couponList(self):
        return self.driver.find_elements_by_xpath(
            "//div[@id='coupon']/div[@class='scout-card scout-discover-content']/ol/li[@class='scout-spot-list-discover']")

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

    def click_Place(self, food='open', num=0):
        placeList = {'open': self.openNearbyList, 'coffee': self.coffeeList, 'breakfast': self.breakfastList, 'late': self.lateList, 'coupon': self.couponList}
        try:
            placeList.get(food)[num]
        except IndexError:
            assert False, ('Index ' + str(num) + ' is out of range: ' + str(len(self.placesList))) # is there a better way?
        else:
            return DetailPage(self.driver)

    def click_Results(self, food='open'):
        linkList = {'open': self.openNearbyView, 'coffee': self.coffeeView, 'breakfast': self.breakfastView, 'late': self.lateView, 'coupon': self.couponView}
        temp = linkList.get(food)
        temp.click()
        return PlacesPage(self.driver)

    def click_discoverTab(self):
        self.discoverTab.click()

    def click_placesTab(self):
        self.placesTab.click()
        return PlacesPage(self.driver)

class PlacesPage(BasePage):

    @property
    def homeLogo(self):
        return self.driver.find_element_by_id('link_home')

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

    def click_home(self):
        self.homeLogo.click()
        return HomePage(self.driver)

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
            return DetailPage(self.driver)

class FilterPage(BasePage):

    @property
    def homeLogo(self):
        return self.driver.find_element_by_id('link_home')

    @property
    def discoverTab(self):
        return self.driver.find_element_by_id('link_discover')

    @property
    def placesTab(self):
        return self.driver.find_element_by_id('link_food')

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

    def click_home(self):
        self.homeLogo.click()
        return HomePage(self.driver)

    def click_discoverTab(self):
        self.discoverTab.click()
        return HomePage(self.driver)

    def click_placesTab(self):
        self.placesTab.click()

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
        return HomePage(self.driver)

    def click_discoverTab(self):
        self.discoverTab.click()
        return HomePage(self.driver)

    def click_placesTab(self):
        self.placesTab.click()

    def assertOpenStatus(self, expected='OPEN NOW'):
        if self.openStatus.text == expected:
            return True
        else:
            return False
