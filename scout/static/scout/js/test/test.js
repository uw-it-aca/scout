var methods = require('../filter');
var jsdom = require('jsdom');
var doc = jsdom.jsdom("<html></html>"),
    window = doc.parentWindow
var $ = require('jquery')(window);
var assert = require('assert');

describe("Filter Tests", function() {
    global.$ = $;
    describe("Get Params For Select", function() {
        it('Cuisine', function() {
            var data = ["s_cuisine_hawaiian"];
            var exp = { cuisine0: 's_cuisine_hawaiian' };
            var temp = methods.Filter._get_params_for_select(data, "cuisine")
            assert.equal(JSON.stringify(exp), JSON.stringify(temp))
        });

    });
});
