var Navigation = require('../navigation').Navigation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeWindowPath = tools.fakeWindowPath;

describe("Navigation Tests", function() {
    describe("Init Location Toggles", function() {
        var link_food;
        var link_discover;
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml(
                '<a id="link_discover"> </a>' +
                '<a id="link_food"> </a>'
            );
            link_food = $("#link_food");
            link_discover = $("#link_discover");
        });
        it ("should disable the correct tab with a URL of /food/", function() {
            global.window = new fakeWindowPath('/food/');
            Navigation.set_page_tab();
            assert.equal(link_food.attr('disabled'), 'disabled');
            assert.equal(link_food.attr('aria-selected'), 'true');
            assert.equal(link_discover.attr('disabled'), undefined);
            assert.equal(link_discover.attr('aria-selected'), undefined);
            var events_discover = $._data(link_discover.get(0), "events");
            var events_food = $._data(link_food.get(0), "events");
            assert.equal(events_discover, undefined);
            // link_food should have a click event that returns false 
            assert.notEqual(events_food.click, undefined);
        });
        it ("shouldn't disable any tabs with a URL of /filter/", function() {
            global.window = new fakeWindowPath('/filter/');
            Navigation.set_page_tab();
            assert.equal(link_food.attr('disabled'), undefined);
            assert.equal(link_discover.attr('disabled'), undefined);
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_discover.attr('aria-selected'), undefined);
        });
        it ("shouldn't disable any tabs with a URL of /detail/", function() {
            global.window = new fakeWindowPath('/detail/');
            Navigation.set_page_tab();
            assert.equal(link_food.attr('disabled'), undefined);
            assert.equal(link_discover.attr('disabled'), undefined);
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_discover.attr('aria-selected'), undefined);
        });
        it ("should disable the correct tabs with a URL of /", function() {
            global.window = new fakeWindowPath('/');
            Navigation.set_page_tab();
            assert.equal(link_discover.attr('disabled'), 'disabled');
            assert.equal(link_discover.attr('aria-selected'), 'true');
            assert.equal(link_food.attr('disabled'), undefined);
            assert.equal(link_food.attr('aria-selected'), undefined);
            var events_discover = $._data(link_discover.get(0), "events");
            var events_food = $._data(link_food.get(0), "events");
            assert.equal(events_food, undefined);
            // link_discover should have a click event that returns false
            assert.notEqual(events_discover.click, undefined);
        });
     });
});
