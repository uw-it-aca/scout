var filter_selections = {
    payment_select: [
        { value: "cafe", checked: true, text: "Cafes"},
        { value: "cafeteria", checked: true, text: "Cafeteria"},
    ]
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

var filter = require('../filter');
var jsdom = require('jsdom');
var html_content = generateHtml(filter_selections);
var doc = jsdom.jsdom(html_content);
var window = doc.parentWindow;
var $ = require('jquery')(window);
var assert = require('assert');

describe("Filter Tests", function() {
    describe("Get Params For Select", function() {
        it('Cuisine', function() {
            global.$ = $;
            var selectedFilters = ["s_cuisine_hawaiian"];
            var exp = { cuisine0: 's_cuisine_hawaiian' };
            var temp = filter.Filter._get_params_for_select(selectedFilters, "cuisine")
            assert.deepEqual(exp, temp)
        });

        it('None', function() {
            global.$ = $;
            var data = [];
            var exp = {};
            var temp = filter.Filter._get_params_for_select(data, "cuisine")
            assert.deepEqual(exp, temp)
        });
    });
    describe("Filter Params", function() {

        sessionVars = {}
        fakeSessionStorage = {
            setItem: function(item, value) {
                sessionVars[item] = value;
            },
            getItem: function(item) {
                return sessionVars[item];
            }
        }

        global.sessionStorage = fakeSessionStorage;
        it ('Checked Off', function() {
            global.$ = $;
            filter.Filter.set_filter_params();
            var exp = { payment0: 'cafe', payment1: 'cafeteria' };
            assert.deepEqual(JSON.parse(sessionVars["filter_params"]), exp);
        });
    });
});

