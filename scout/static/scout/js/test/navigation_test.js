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
        it ("it should highlight the 'discover' tab only", function() {
            global.window = new fakeWindowPath('/');
            Navigation.set_page_tab();
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_discover.attr('aria-selected'), 'true');
            assert.equal(link_discover.attr('style'), 'border-bottom: 4px solid #6564A8; color: rgb(101, 100, 168);');
       });
       it ("it should highlight the 'places' tab only", function() {
            global.window = new fakeWindowPath('/food/');
            Navigation.set_page_tab();
            assert.equal(link_discover.attr('aria-selected'), undefined);
            assert.equal(link_food.attr('aria-selected'), 'true');
            assert.equal(link_food.attr('style'), 'border-bottom: 4px solid #6564A8; color: rgb(101, 100, 168);');
       });
       it ("it should highlight the 'places' tab only", function() {
            global.window = new fakeWindowPath('/detail/');
            Navigation.set_page_tab();
            assert.equal(link_discover.attr('aria-selected'), undefined);
            assert.equal(link_food.attr('aria-selected'), 'true');
            assert.equal(link_food.attr('style'), 'border-bottom: 4px solid #6564A8; color: rgb(101, 100, 168);');
       });
    });
});
