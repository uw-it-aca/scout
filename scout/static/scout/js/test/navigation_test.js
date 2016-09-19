var Navigation = require('../navigation').Navigation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeWindowPath = tools.fakeWindowPath;
var fakeSess = require('./testing_tools').fakeSessionStorage;

describe("Navigation Tests", function() {
    describe("Init Location Toggles", function() {
        var campus;
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml(
                '<select id="campus_select_base">' + 
                '<option value="seattle">Seattle</option>' +
                '<option value="bothell">Bothell</option>' +
                '<option value="tacoma">Tacoma</option>' +
                '</select>'
            );
            campus = $("#campus_select_base");
        });

        it ("The URL changes if the Campus Value Changes (Bothell)", function() {
            global.window = new fakeWindowPath('/seattle/food/');
            Navigation.set_campus_selection();
            campus.val("bothell");
            campus.trigger("change");

            assert.equal(global.window.location, '/bothell/food/');
        });
        it ("The URL changes if the Campus Value Changes (Tacoma)", function() {
            global.window = new fakeWindowPath('/seattle/study/');
            Navigation.set_campus_selection();
            campus.val("tacoma");
            campus.trigger("change");

            assert.equal(global.window.location, '/tacoma/study/');
        });
        it ("The URL changes if the Campus Value Changes (Seattle)", function() {
            global.window = new fakeWindowPath('/bothell/');
            Navigation.set_campus_selection();
            campus.val("seattle");
            campus.trigger("change");

            assert.equal(global.window.location, '/seattle/');
        });
        it ("The URL removes the params when changing campuses", function() {
            global.window = new fakeWindowPath('/seattle/food/?payment0=s_pay_husky');
            var sessVars = new fakeSess(
                {food_filter_params: '{"payment0":"s_pay_husky"}'}
            );
            global.sessionStorage = sessVars;
            Navigation.set_campus_selection();
            campus.val("tacoma");
            campus.trigger("change");

            assert.equal(global.window.location, '/tacoma/food/');
        });
    });
});
