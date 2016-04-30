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

var filter_selections1 = {
    payment_select: [
        { value: "s_pay_cash", checked: false, text: "Husky Card"},
        { value: "s_pay_dining", checked: false, text: "Dining Card"},
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

var jqueryFromHtml = function jqueryFromHtml(filters) {
    var html_content = generateHtml(filters);
    var doc = jsdom.jsdom(html_content);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
}

var getDefaultJquery = function(filters) {
    if (filters === undefined) {
        filters = filter_selections;
    };
    return jqueryFromHtml(filters);
};

describe("Filter Tests", function() {
    describe("Initialization", function() {
        it('should do nothing when filter_params is null', function() {
            global.$ = getDefaultJquery(filter_selections1);
            var sessVars = new fakeSess();
            global.sessionStorage = sessVars;
            filter.Filter.init();
        });
        it('should check off two checkboxes on the html page', function() {
            global.$ = getDefaultJquery(filter_selections1);
            var sessVars = new fakeSess({ sessionVars: { filter_params: '{"payment0":"s_pay_cash", "payment1":"s_pay_dining"}' } });
            global.sessionStorage = sessVars;
            filter.Filter.init();
            console.log(global.sessionStorage);
            console.log($("html").html());  
        });

    });
    describe("Filter Params", function() { 
        it ('returns the right params for varied filters', function() {
            global.$ = getDefaultJquery();
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            filter.Filter.set_filter_params();
            var exp = {type0 : 'cafe', type1 : 'cafeteria', food0: "s_food_frozen_yogurt"};
            assert.deepEqual(JSON.parse(sessionVars.getItem("filter_params")), exp);
        });
    });
});

