var filter = require('../filter');
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var fakeSess = require('./testing_tools').fakeSessionStorage;

var filter_selections = {
    type_select: [
        { value: "cafe", checked: true, text: "Cafes"},
        { value: "cafeteria", checked: true, text: "Cafeteria"},
    ], 
    payment_select: [
        { value: "s_pay_cash", checked: false, text: "Husky Card"},
        { value: "s_pay_dining", checked: false, text: "Dining Card"},
    ],
    food_select: [
        { value: "s_food_frozen_yogurt", checked: true, text: "Frozen Yogurt"},
        { value: "s_food_smoothies", checked: false, text: "Smoothies"},
    ],
};

var generateSection = function generateSection(label, data){
    var result = '<div id="';
    result += label + '"> ';
    for (i = 0; i < data.length; i++) {
        result += "<label> ";
        result += '<input type="checkbox" value="';
        result += data[i]["value"] + '"';
        if (data[i]["checked"]) {
            result += ' checked="true"';
        }
        result += "/> ";
        result += data[i]["text"];
        result += "</label> ";
    }
    result += "</div> ";
    return result; 
}

var generateHtml = function generateHtml(filterData) {
    out = '';
    for (section in filterData) {
        out += generateSection(section, filterData[section]);
    };
    return out;
};

var jqueryFromHtml = function jqueryFromHtml(html) {
    var html_content = generateHtml(filter_selections);
    var doc = jsdom.jsdom(html_content);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
}

var defaultJquery = jqueryFromHtml(generateHtml(filter_selections));

describe("Filter Tests", function() {
    describe("Get Params For Select", function() {
        it('Cuisine', function() {
            global.$ = defaultJquery;
            var selectedFilters = ["s_cuisine_hawaiian"];
            var exp = { cuisine0: 's_cuisine_hawaiian' };
            var temp = filter.Filter._get_params_for_select(selectedFilters, "cuisine")
            assert.deepEqual(exp, temp)
        });

        it('None', function() {
            global.$ = defaultJquery;
            var data = [];
            var exp = {};
            var temp = filter.Filter._get_params_for_select(data, "cuisine")
            assert.deepEqual(exp, temp)
        });
    });
    describe("Filter Params", function() {

        sessionVars = new fakeSess();

        global.sessionStorage = sessionVars;
        it ('Checked Off', function() {
            global.$ = defaultJquery;
            filter.Filter.set_filter_params();
            var exp = {type0 : 'cafe', type1 : 'cafeteria', food0: "s_food_frozen_yogurt"};
            assert.deepEqual(JSON.parse(sessionVars.getItem("filter_params")), exp);
        });
    });
});

