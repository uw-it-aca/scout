var Navigation = require('../navigation').Navigation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeWindowPath = tools.fakeWindowPath;

describe("Navigation Tests", function() {
    describe("Init Location Toggles", function() {

        var link_home, link_food, link_study, link_tech;

        beforeEach(function() {
            global.$ = tools.jqueryFromHtml(
                '<a id="link_home"> </a>' +
                '<a id="link_food"> </a>' +
                '<a id="link_study"> </a>' +
                '<a id="link_tech"> </a>'
            );
            link_home = $("#link_home");
            link_food = $("#link_food");
            link_study = $("#link_study");
            link_tech = $("#link_tech");
        });

        it ("no tabs should be highlighted", function() {
            global.window = new fakeWindowPath('/');
            //Navigation.set_page_tab();

            //assert.equal(link_home.attr('aria-selected'), 'true');
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_study.attr('aria-selected'), undefined);
            assert.equal(link_tech.attr('aria-selected'), undefined);
        });
        it ("it should highlight the 'food' tab only", function() {
            global.window = new fakeWindowPath('/food/');
            //Navigation.set_page_tab();

            assert.equal(link_food.attr('aria-selected'), 'true');
            assert.equal(link_food.attr('class'), 'active');

            assert.equal(link_home.attr('aria-selected'), undefined);
            assert.equal(link_study.attr('aria-selected'), undefined);
            assert.equal(link_tech.attr('aria-selected'), undefined);
        });
        it ("it should highlight the 'study' tab only", function() {
            global.window = new fakeWindowPath('/study/');
            //Navigation.set_page_tab();

            assert.equal(link_study.attr('aria-selected'), 'true');
            assert.equal(link_study.attr('class'), 'active');

            assert.equal(link_home.attr('aria-selected'), undefined);
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_tech.attr('aria-selected'), undefined);
        });
        it ("it should highlight the 'tech' tab only", function() {
            global.window = new fakeWindowPath('/tech/');
            //Navigation.set_page_tab();

            assert.equal(link_tech.attr('aria-selected'), 'true');
            assert.equal(link_tech.attr('class'), 'active');

            assert.equal(link_home.attr('aria-selected'), undefined);
            assert.equal(link_food.attr('aria-selected'), undefined);
            assert.equal(link_study.attr('aria-selected'), undefined);
        });

     });
});
