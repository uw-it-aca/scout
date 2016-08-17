var Filter = require('../filter').Filter;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeSess = require('./testing_tools').fakeSessionStorage;
var fakeWindow = require('./testing_tools').fakeWindow;
var default_campus = 'seattle'
/*
These following associative arrays store info that is used to
generate the mock html that the test methods test
*/
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
    food_select: [
        { value: "s_food_smoothies", checked: false, text: "Smoothies"},
    ],
};

var filter_selections2 = {
    payment_select: [
        { value: "s_pay_cash", checked: true, text: "Husky Card"},
        { value: "s_pay_dining", checked: true, text: "Dining Card"},
    ],
    food_select: [
        { value: "s_food_smoothies", checked: true, text: "Smoothies"},
    ],
};

var default_selections = {
    payment_select: [
        { value: "s_pay_cash", checked: false, text: "Husky Card"},
    ],
};

// Generates a html div element with given id, creates the
// filters (labels with checkboxes) modeled by the given data
var generateSection = function generateSection(id, data){
    var result = '<div id="';
    result += id + '"> ';
    for (i = 0; i < data.length; i++) {
        result += "<label>";
        result += '<input type="checkbox" value="';
        result += data[i].value + '"';
        if (data[i].checked) {
            result += ' checked="true"';
        }
        result += "/> ";
        result += data[i].text;
        result += "</label>";
    }
    result += "</div>";
    return result;
};

// Given the filterData, creates html div elements of each
// filter "section" with its given filters (labels with checkboxes)
var generateHtml = function generateHtml(filterData) {
    var out = '';
    for (var section in filterData) {
        out += generateSection(section, filterData[section]);
    }
    return out;
};

// Given the filterData, returns the appropriate jQuery
var getDefaultJquery = function(filters) {
    if (filters === undefined) {
        filters = default_selections;
    }
    return tools.jqueryFromHtml(generateHtml(filters));
};

// Test Methods for filter.js, each section of tests
// test a specific method and the potential cases that the
// method may face
describe("Filter Tests", function() {
    describe("Initialization", function() {
        beforeEach(function() {
            global.$ = getDefaultJquery(filter_selections1);
        });
        it('should do nothing when filter_params is null', function() {
             var sessVars = new fakeSess();
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the filter checkboxes are still unchecked
            filter_item = $("#food_select").find("input[value='s_food_smoothies']");
            filter_item2 = $("#payment_select").find("input[value='s_pay_cash']");
            filter_item3 = $("#payment_select").find("input[value='s_pay_dining']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), false );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
        });
        it('should check off two checkboxes based on the filter_params', function() {
            var sessVars = new fakeSess(
                {filter_params: '{"payment0":"s_pay_cash", "payment1":"s_pay_dining"}'}
            );
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#food_select").find("input[value='s_food_smoothies']");
            filter_item2 = $("#payment_select").find("input[value='s_pay_cash']");
            filter_item3 = $("#payment_select").find("input[value='s_pay_dining']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), true );
        });
        it('should be able to check off checkboxes in different sections', function() {
            global.$ = getDefaultJquery(filter_selections1);
            var sessVars = new fakeSess({
                filter_params: '{"payment0":"s_pay_cash", "food0":"s_food_smoothies"}'
            });
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#food_select").find("input[value='s_food_smoothies']");
            filter_item2 = $("#payment_select").find("input[value='s_pay_cash']");
            filter_item3 = $("#payment_select").find("input[value='s_pay_dining']");
            assert.equal(($(filter_item[0]).prop("checked")), true );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), false );

        });
    });

    describe("Get Params For Select", function() {
        global.$ = getDefaultJquery();
        it('should return formatted parameters correctly for one filter', function() {
            var selectedFilters = ["s_cuisine_hawaiian"];
            var exp = {cuisine0: 's_cuisine_hawaiian'};
            var actual = Filter._get_params_for_select(selectedFilters, "cuisine");
            assert.deepEqual(exp, actual);
        });

        it('should return multiple formatted parameters correctly', function() {
            var selectedFilters = ["food_court", "market", "restaurant"];
            var exp = {type0: "food_court", type1: "market", type2: "restaurant"};
            var actual = Filter._get_params_for_select(selectedFilters, "type");
            assert.deepEqual(exp, actual);
        });

        it('should return empty parameters for no filters', function() {
            var data = [];
            var exp = {};
            var actual = Filter._get_params_for_select(data, "cuisine");
            assert.deepEqual(exp, actual);
        });
    });

    describe("Filter Params", function() {
        it('returns empty params for no filters checked off', function() {
            global.$ = getDefaultJquery();
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.set_filter_params();
            var exp = {};
            assert.deepEqual(JSON.parse(sessionVars.getItem("filter_params")), exp);

        });
        it('returns the right params for varied filters', function() {
            global.$ = getDefaultJquery(filter_selections);
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.set_filter_params();
            var exp = {type0 : 'cafe', type1 : 'cafeteria', food0: "s_food_frozen_yogurt"};
            // Check to see if the right filter params are generated
            assert.deepEqual(JSON.parse(sessionVars.getItem("filter_params")), exp);
        });
        it('returns the right params after page is init with previous filters', function() {
            global.$ = getDefaultJquery(filter_selections1);
            var sessionVars = new fakeSess({ filter_params: '{"payment0":"s_pay_cash"}'});
            global.sessionStorage = sessionVars;
            Filter.init();
            Filter.set_filter_params();
            var exp = {payment0 : 's_pay_cash'};
            // Check to see if the right filter params are generated
            assert.deepEqual(JSON.parse(sessionVars.getItem("filter_params")), exp);
        });
    });

    describe("Get Filter URL", function() {
        it('returns a default campus location URL when there are no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url();
            assert.equal(value, "campus0=" + default_campus);
        });
        it('returns the correct URL when there is one filter', function() {
            var sessionVars = new fakeSess(
                { filter_params: '{"payment0":"s_pay_cash"}'}
            );
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url();
            assert.equal(value, 'payment0=s_pay_cash');
        });
        it('returns the correct URL for a complex filter', function() {
            var sessionVars = new fakeSess({ filter_params: JSON.stringify({
                campus0: "seattle",
                cuisine0: "s_cuisine_indian",
                type0: "food_court",
                type1: "market",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            var filter_url = Filter.get_filter_url();
            // Take the generated url and split it up in alpha order
            var filter_url_parts = filter_url.split('&');
            filter_url_parts.sort();
            var expected = [
                'campus0=seattle',
                'cuisine0=s_cuisine_indian',
                'open_now=true',
                'type0=food_court',
                'type1=market',
            ];
            expected.sort();
            // Check to see if the components are equal
            assert.deepEqual(expected, filter_url_parts);
        });
        it('returns the URL in the right order for a filter', function() {
            var sessionVars = new fakeSess({ filter_params: JSON.stringify({
                payment0: "s_pay_visa",
                type0: "food_truck",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url();
            exp = "payment0=s_pay_visa&type0=food_truck&open_now=true";
            assert.equal(value, exp);
        });
    });

    describe("Replace Food Href", function() {
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml('<a href="" id="link_food">Places</a>');
        });
        it('the link_food is replaced with the href of no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.replace_food_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr('href');
            var exp = "/food/?campus0=" + default_campus;
            assert.deepEqual(value, exp);
        });
        it('the link_food is replaced with the expected href of one filter', function() {
            var sessionVars = new fakeSess(
                { filter_params: '{"payment0": "s_pay_cash"}'}
            );
            global.sessionStorage = sessionVars;
            Filter.replace_food_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr('href');
            var exp = "/food/?payment0=s_pay_cash";
            assert.deepEqual(value, exp);
        });
        it('the link_food is replaced with the expected href of multiple filters', function() {
            var sessionVars = new fakeSess({ filter_params: JSON.stringify({
                payment0: "s_pay_visa",
                type0: "food_truck",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            Filter.replace_food_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr('href');
            var exp = "/food/?payment0=s_pay_visa&type0=food_truck&open_now=true";
            assert.deepEqual(value, exp);
        });
    });

    describe("Reset Filter", function() {
        var sessionVars;
        before(function() {
            global.$ = getDefaultJquery(filter_selections2);
            sessionVars = new fakeSess(
                { filter_params: '{"payment0": "s_pay_cash"}'}
            );
            global.sessionStorage = sessionVars;
            global.window = new fakeWindow("/food/");
            Filter.reset_filter();
        });
        it('should remove the session variables ("filter_params")', function() {
            // Testing that the filter params are removed from session storage replaced with the default campus
            assert.deepEqual(global.sessionStorage.sessionVars.filter_params, '{"campus0":"' + default_campus + '"}');
        });
        it('should change the window location', function() {
            // Testing that the window's href has changed back to the default campus
            assert.equal(global.window.location.href, '/food/?campus0=' + default_campus);
        });
    });

    describe("Get Filter Label Text", function() {
        it('should return the right text with a URL with three different categories', function() {
            global.window = new fakeWindow(
                "/food/?payment0=s_pay_visa" +
                "&type0=food_truck&open_now=true"
            );
            var result = Filter._get_filter_label_text();
            var exp = "Payment Accepted, Restaurant Type, Open Now";
            assert.equal(result, exp);
        });
        it('should return the right text with a URL containing filters from same category', function() {
            global.window = new fakeWindow(
                "/food/?period0=breakfast" +
                "&period1=lunch&period2=dinner"
            );
            var result = Filter._get_filter_label_text();
            var exp = "Open Period";
            assert.equal(result, exp);
        });
        it('should return the right text with a URL containing multiple filters from same/different categories', function() {
            global.window = new fakeWindow(
                "/food/?campus0=tacoma" +
                "&period0=breakfast&period1=lunch" +
                "&period2=dinner&open_now=true"
            );
            var result = Filter._get_filter_label_text();
            var exp = "Campus, Open Period, Open Now";
            assert.equal(result, exp);
        });
        it('should return an empty string if the URL doesnt contain any filters', function() {
            global.window = new fakeWindow("/food/");
            var result = Filter._get_filter_label_text();
            var exp = "";
            assert.equal(result, exp);
        });
    });

    describe("Set Filter Text", function() {
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml(
                '<div class="scout-filter-results-text"' +
                ' id="filter_label_text">--</div>'
            );
        });
        it('should not change the filter text, if the URL is empty', function() {
            global.window = new fakeWindow("");
            Filter.set_filter_text();
            assert.equal($("#filter_label_text").html(), "--");
        });
        it('should change the filter text, if the URL contains a filter', function() {
            global.window = new fakeWindow("/food/?campus0=tacoma");
            Filter.set_filter_text();
            assert.equal($("#filter_label_text").html(), "Campus");
        });
    });

    describe("Init Events", function() {
        before(function() {
            global.$ = tools.jqueryFromHtml(
                '<input id="reset_button" type="button"' +
                ' value="Reset"> <input id="run_search"' +
                ' type="button" value="View Results"> ' +
                '<a id="reset_filter"> <input id="noevents">'
            );
            Filter.init_events();
        });
        // These methods check to see if the css selectors
        // have/don't have events attached to them
        it('should attach an event to run_search', function() {
            var elem = "#run_search";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to reset_button', function() {
            var elem = "#reset_button";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should not attach an event to noevents', function() {
            var elem = "#noevents";
            var events = $._data($(elem).get(0), "events");
            assert.equal(events, undefined);
        });
    });
});
