var Navigation = require('../navigation').Navigation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeWindow = require('./testing_tools').fakeWindowPath;

describe("Nav Tests", function() {
    describe("Init Location Toggles", function() {
        it ("test", function() {
            global.window = fakeWindow('/food');
            console.log(global.window.pathname);
            Navigation.set_page_tab();
        });
     });
});
