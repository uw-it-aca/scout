var Filter = require('../filter').Filter;
var Food_Filter = require('../filter-food').Food_Filter;
var Study_Filter = require('../filter-study').Study_Filter;
var Tech_Filter = require('../filter-tech').Tech_Filter;
var Navigation = require('../navigation').Navigation;

var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeSess = require('./testing_tools').fakeSessionStorage;
var fakeWindow = require('./testing_tools').fakeWindow;
var default_campus = 'seattle'

global.Food_Filter = Food_Filter
global.Study_Filter = Study_Filter
global.Tech_Filter = Tech_Filter
global.Navigation = Navigation
global.Filter = Filter

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

var study_selections1 = {
    type_select: [
        { value: "study_area", checked: false, text: "Study area"},
        { value: "lounge", checked: false, text: 'Lounge'},
    ],
    resources_select: [
        { value: 'has_outlets', checked: false, text: "Outlets"},
        { value: "has_printing", checked: false, text: "Printing"},
    ],
    lighting_select: [
        { value: "has_natural_light", checked: false, text: "Natural Light"},
    ],
};

var tech_selections1 = {
    brand_select: [
        { value: "Sony", checked: false, text: "Sony"},
        { value: "Vello", checked: false, text: "Vello"},
    ],
    subcategory_select: [
        { value: "Calculator", checked: false, text: "Calculator"},
        { value: "Tripod", checked: false, text: "Tripod"},
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
    describe("Food Initialization", function() {
        beforeEach(function() {
            global.$ = getDefaultJquery(filter_selections1);
            // We need this because we get the type from the URL
            global.window = new fakeWindow("/seattle/food/filter/");
        });
        it('should do nothing when the food filter_params is null', function() {
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
        it('should check off two checkboxes based on the food filter_params', function() {
            var sessVars = new fakeSess(
                {food_filter_params: '{"payment0":"s_pay_cash", "payment1":"s_pay_dining"}'}
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
                food_filter_params: '{"payment0":"s_pay_cash", "food0":"s_food_smoothies"}'
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
    describe("Study Initialization", function() {
        beforeEach(function() {
            global.$ = getDefaultJquery(study_selections1);
            // We need this because we get the type from the URL
            global.window = new fakeWindow("/seattle/study/filter/");
        });
        it('should do nothing when the study filter_params is null', function() {
            var sessVars = new fakeSess();
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the filter checkboxes are still unchecked
            filter_item = $("#type_select").find("input[value='study_area']");
            filter_item2 = $("#resources_select").find("input[value='has_outlets']");
            filter_item3 = $("#lighting_select").find("input[value='has_natural_light']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), false );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
        });
        it('should check off two checkboxes based on the study filter_params', function() {
            var sessVars = new fakeSess(
                {study_filter_params: '{"resources0":"has_outlets", "resources1":"has_printing"}'}
            );
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#type_select").find("input[value='study_area']");
            filter_item1 = $("#resources_select").find("input[value='has_outlets']");
            filter_item2 = $("#resources_select").find("input[value='has_printing']");
            filter_item3 = $("#lighting_select").find("input[value='has_natural_light']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item1[0]).prop("checked")), true );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
        });
        it('should be able to check off checkboxes in different sections', function() {
            var sessVars = new fakeSess(
                {study_filter_params: '{"type0":"study_area", ' +
                                      '"resources0":"has_printing", ' +
                                      '"lighting0":"has_natural_light"}'
            });
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#type_select").find("input[value='study_area']");
            filter_item1 = $("#resources_select").find("input[value='has_outlets']");
            filter_item2 = $("#resources_select").find("input[value='has_printing']");
            filter_item3 = $("#lighting_select").find("input[value='has_natural_light']");
            assert.equal(($(filter_item[0]).prop("checked")), true );
            assert.equal(($(filter_item1[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), true );
        });
    });

    describe("Tech Initialization", function() {
        beforeEach(function() {
            global.$ = getDefaultJquery(tech_selections1);
            // We need this because we get the type from the URL
            global.window = new fakeWindow("/seattle/tech/filter/");
        });
        it('should do nothing when the tech filter_params is null', function() {
            var sessVars = new fakeSess();
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the filter checkboxes are still unchecked
            filter_item = $("#brand_select").find("input[value='Sony']");
            filter_item2 = $("#brand_select").find("input[value='Vello']");
            filter_item3 = $("#subcategory_select").find("input[value='Calculator']");
            filter_item4 = $("#subcategory_select").find("input[value='Tripod']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), false );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
            assert.equal(($(filter_item4[0]).prop("checked")), false );
        });
        it('should check off two checkboxes based on the tech filter_params', function() {
            var sessVars = new fakeSess(
                {tech_filter_params: '{"brand0":"Vello", "subcategory0":"Tripod"}'}
            );
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#brand_select").find("input[value='Sony']");
            filter_item2 = $("#brand_select").find("input[value='Vello']");
            filter_item3 = $("#subcategory_select").find("input[value='Calculator']");
            filter_item4 = $("#subcategory_select").find("input[value='Tripod']");
            assert.equal(($(filter_item[0]).prop("checked")), false );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
            assert.equal(($(filter_item4[0]).prop("checked")), true );
        });
        it('should be able to check off checkboxes in different sections', function() {
            var sessVars = new fakeSess(
                {tech_filter_params: '{"brand0":"Sony", "brand1":"Vello", "subcategory0":"Tripod"}'}
            );
            global.sessionStorage = sessVars;
            Filter.init();
            // Check to see if the intended filters are checked off
            filter_item = $("#brand_select").find("input[value='Sony']");
            filter_item2 = $("#brand_select").find("input[value='Vello']");
            filter_item3 = $("#subcategory_select").find("input[value='Calculator']");
            filter_item4 = $("#subcategory_select").find("input[value='Tripod']");
            assert.equal(($(filter_item[0]).prop("checked")), true );
            assert.equal(($(filter_item2[0]).prop("checked")), true );
            assert.equal(($(filter_item3[0]).prop("checked")), false );
            assert.equal(($(filter_item4[0]).prop("checked")), true );
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
            Food_Filter.set_filter_params();
            var exp = {};
            assert.deepEqual(JSON.parse(sessionVars.getItem("food_filter_params")), exp);
        });
        it('returns the right params for varied filters', function() {
            global.$ = getDefaultJquery(filter_selections);
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Food_Filter.set_filter_params();
            var exp = {type0 : 'cafe', type1 : 'cafeteria', food0: "s_food_frozen_yogurt"};
            // Check to see if the right filter params are generated
            assert.deepEqual(JSON.parse(sessionVars.getItem("food_filter_params")), exp);
        });
        it('returns the right params after page is init with previous filters', function() {
            global.window = new fakeWindow("/seattle/food/filter/");
            global.$ = getDefaultJquery(filter_selections1);
            var sessionVars = new fakeSess({ food_filter_params: '{"payment0":"s_pay_cash"}'});
            global.sessionStorage = sessionVars;
            Filter.init();
            Food_Filter.set_filter_params();
            var exp = {payment0 : 's_pay_cash'};
            // Check to see if the right filter params are generated
            assert.deepEqual(JSON.parse(sessionVars.getItem("food_filter_params")), exp);
        });
    });

    describe("Get Filter URL", function() {
        it('returns an undefined URL when there are no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url("food");
            assert.equal(value, undefined);
        });
        it('returns the correct URL when there is one filter', function() {
            var sessionVars = new fakeSess(
                { food_filter_params: '{"payment0":"s_pay_cash"}'}
            );
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url("food");
            assert.equal(value, 'payment0=s_pay_cash');
        });
        it('returns the correct URL for a complex filter', function() {
            var sessionVars = new fakeSess({ food_filter_params: JSON.stringify({
                campus0: "seattle",
                cuisine0: "s_cuisine_indian",
                type0: "food_court",
                type1: "market",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            var filter_url = Filter.get_filter_url("food");
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
            var sessionVars = new fakeSess({ food_filter_params: JSON.stringify({
                payment0: "s_pay_visa",
                type0: "food_truck",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            value = Filter.get_filter_url("food");
            exp = "payment0=s_pay_visa&type0=food_truck&open_now=true";
            assert.equal(value, exp);
        });
    });

    describe("Replace Food Href", function() {
        // Seeing if the right href gets attached to the button based on the params
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml('<a href="/seattle/food/" id="link_food">Places</a>');
        });
        it('the link_food is replaced with the href of no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr("href");
            var exp = "/" + default_campus + "/food/";
            assert.deepEqual(value, exp);
        });
        it('the link_food is replaced with the expected href of one filter', function() {
            var sessionVars = new fakeSess(
                { food_filter_params: '{"payment0": "s_pay_cash"}'}
            );
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr('href');
            var exp = "/" + default_campus + "/food/?payment0=s_pay_cash";
            assert.deepEqual(value, exp);
        });
        it('the link_food is replaced with the expected href of multiple filters', function() {
            var sessionVars = new fakeSess({ food_filter_params: JSON.stringify({
                payment0: "s_pay_visa",
                type0: "food_truck",
                open_now: "true",
                })
            });
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var food_anchor = $("#link_food");
            var value = $(food_anchor).attr('href');
            var exp = "/" + default_campus + "/food/?payment0=s_pay_visa&type0=food_truck&open_now=true";
            assert.deepEqual(value, exp);
        });
    });

    describe("Replace Study Href", function() {
        // Seeing if the right href gets attached to the button based on the params
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml('<a href="/seattle/study/" id="link_study">Places</a>');
        });
        it('the link_study is replaced with the href of no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var study_anchor = $("#link_study");
            var value = $(study_anchor).attr('href');
            var exp = "/" + default_campus + "/study/"
            assert.deepEqual(value, exp);
        });
        it('the link_study is replaced with the expected href of one filter', function() {
            var sessionVars = new fakeSess(
                { study_filter_params: '{"resources0": "has_outlets"}'}
            );
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var study_anchor = $("#link_study");
            var value = $(study_anchor).attr('href');
            var exp = "/" + default_campus + "/study/?resources0=has_outlets";
            assert.deepEqual(value, exp);
        });
        it('the link_study is replaced with the expected href of multiple filters', function() {
            var sessionVars = new fakeSess({ study_filter_params: JSON.stringify({
                resources0: "has_outlets",
                type0: "study_area",
                food0: "building",
                })
            });
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var study_anchor = $("#link_study");
            var value = $(study_anchor).attr('href');
            var exp = "/" + default_campus + "/study/?resources0=has_outlets&type0=study_area&food0=building";
            assert.deepEqual(value, exp);
        });
    });
    describe("Replace Tech Href", function() {
        // Seeing if the right href gets attached to the button based on the params
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml('<a href="/seattle/tech/" id="link_tech">Places</a>');
        });
        it('the link_tech is replaced with the href of no filters', function() {
            var sessionVars = new fakeSess();
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var tech_anchor = $("#link_tech");
            var value = $(tech_anchor).attr('href');
            var exp = "/" + default_campus + "/tech/"
            assert.deepEqual(value, exp);
        });
        it('the link_tech is replaced with the expected href of one filter', function() {
            var sessionVars = new fakeSess(
                { tech_filter_params: '{"brand0": "Sony"}'}
            );
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var tech_anchor = $("#link_tech");
            var value = $(tech_anchor).attr('href');
            var exp = "/" + default_campus + "/tech/?brand0=Sony";
            assert.deepEqual(value, exp);
        });
        it('the link_tech is replaced with the expected href of multiple filters', function() {
            var sessionVars = new fakeSess({ tech_filter_params: JSON.stringify({
                brand0: "LG",
                brand1: "Sony",
                subcategory0: "Calculator",
                })
            });
            global.sessionStorage = sessionVars;
            Filter.replace_navigation_href();
            var tech_anchor = $("#link_tech");
            var value = $(tech_anchor).attr('href');
            var exp = "/" + default_campus + "/tech/?brand0=LG&brand1=Sony&subcategory0=Calculator";
            assert.deepEqual(value, exp);
        });
    });

    describe("Reset Filter", function() {
        var sessionVars;
        before(function() {
            global.$ = getDefaultJquery(filter_selections2);
            sessionVars = new fakeSess(
                { food_filter_params: '{"payment0": "s_pay_cash"}'}
            );
            sessionVars = new fakeSess(
                { study_filter_params: '{"type0": "study_area"}'}
            );
            global.sessionStorage = sessionVars;
            global.window = new fakeWindow("/seattle/food/");
            // Should remove food params, should link to default food
            Filter.reset_filter('food_filter_params', 'food');
        });
        it('should remove the food session variables ("food_filter_params")', function() {
            // Testing that the food filter params are removed from session storage
            assert.deepEqual(global.sessionStorage.sessionVars.food_filter_params, undefined);
        });
        it('should not remove the study session variables ("study_filter_params")', function() {
            // Testing that the study filter params are not removed from session storage
            assert.deepEqual(global.sessionStorage.sessionVars.study_filter_params, '{"type0": "study_area"}');
        });
        it('should change the window location', function() {
            // Testing that the window's href has changed back to the default campus
            assert.equal(global.window.location.pathname, '/' + default_campus + '/food/');
        });
    });

    describe("Get Filter Label Text", function() {
        it('should return the right text with a FOOD URL with three different categories', function() {
            global.window = new fakeWindow(
                "/food/?payment0=s_pay_visa" +
                "&type0=food_truck&open_now=true"
            );
            var result = Filter._get_filter_label_text();
            var exp = "Payment Accepted, Restaurant Type, Open Now";
            assert.equal(result, exp);
        });
        it('should return the right text with a FOOD URL containing multiple filters from same/different categories', function() {
            global.window = new fakeWindow(
                "/food/?campus0=tacoma" +
                "&period0=breakfast&period1=lunch" +
                "&period2=dinner&open_now=true"
            );
            var result = Filter._get_filter_label_text();
            var exp = "Open Period, Open Now";
            assert.equal(result, exp);
        });
        it('should return an empty string if the FOOD URL doesnt contain any filters', function() {
            global.window = new fakeWindow("/food/");
            var result = Filter._get_filter_label_text();
            var exp = "";
            assert.equal(result, exp);
        });
        it('should return the right text with a STUDY URL with four different categories', function() {
            global.window = new fakeWindow(
                '/study/?resources0=has_outlets' +
                '&noise0=quiet&food0=space'
            );
            var result = Filter._get_filter_label_text();
            var exp = "Refreshments, Noise Level, Resources, Open Now";
            assert.equal(result, exp);
        });
        it('should return empty string if the STUDY URL doesnt contain any filters', function() {
            global.window = new fakeWindow('/study/');
            var result = Filter._get_filter_label_text();
            var exp = "Open Now";
            assert.equal(result, exp);
        });
        it('should return the right text with a STUDY URL containing multiple filters from same/different categories', function() {
            global.window = new fakeWindow(
                '/study/?resources0=has_computers&resources1=has_printing' +
                '&type0=lounge&type1=outdoor&noise0=quiet'
            );
            var result = Filter._get_filter_label_text();
            var exp = "Study Type, Noise Level, Resources, Open Now";
            assert.equal(result, exp);
        });
        it('should return the right text with a TECH URL with two different categories', function() {
            global.window = new fakeWindow(
                '/tech/?brand0=Panasonic&' +
                'subcategory0=Laptop+Computer+(short+term)'
            );
            var result = Filter._get_filter_label_text();
            var exp = "Brand, Type";
            assert.equal(result, exp);
        });
        it('should return empty string if the TECH URL doesnt contain any filters', function() {
            global.window = new fakeWindow('/tech/');
            var result = Filter._get_filter_label_text();
            var exp = "";
            assert.equal(result, exp);
        });
        it('should return the right text with a TECH URL containing multiple filters from same/different categories', function() {
            global.window = new fakeWindow(
                '/tech/?brand0=Panasonic&brand1=Sony&' +
                'subcategory0=Calculator&subcategory1=Data+Projector'
            );
            var result = Filter._get_filter_label_text();
            var exp = "Brand, Type";
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
            global.window = new fakeWindow("/food/?type0=cafeteria");
            Filter.set_filter_text();
            assert.equal($("#filter_label_text").html(), "Restaurant Type");
        });
    });

    describe("Init Events", function() {
        before(function() {
            global.$ = tools.jqueryFromHtml(
                '<input id="reset_food_button" type="button"' +
                ' value="Reset"> <input id="run_food_search"' +
                ' type="button" value="View Results"> ' +
                '<input id="reset_tech_button" type="button"' +
                ' value="Reset"> <input id="run_tech_search"' +
                ' type="button" value="View Results"> ' +
                '<input id="reset_study_button" type="button"' +
                ' value="Reset"> <input id="run_study_search"' +
                ' type="button" value="View Results"> ' +
                '<input id="noevents">'
            );
            Filter.init_events();
        });
        // These methods check to see if the css selectors
        // have/don't have events attached to them
        it('should attach an event to food run_search', function() {
            var elem = "#run_food_search";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to food reset_button', function() {
            var elem = "#reset_food_button";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to study run_search', function() {
            var elem = "#run_study_search";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to study reset_button', function() {
            var elem = "#reset_study_button";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to tech run_search', function() {
            var elem = "#run_tech_search";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should attach an event to tech reset_button', function() {
            var elem = "#reset_tech_button";
            var events = $._data($(elem).get(0), "events");
            assert.notEqual(events, undefined);
        });
        it('should not attach an event to noevents', function() {
            var elem = "#noevents";
            var events = $._data($(elem).get(0), "events");
            assert.equal(events, undefined);
        });
    });

    describe("Hours_To_Server_Hours", function() {
        it('should turn hours into server_hours Format Pt.1', function() {
            var result = Study_Filter.process_hours_into_server_hours("Tuesday", "12:00", "AM");
            var exp = "Tuesday,00:00"
            assert.equal(result, exp);
        });
        it('should turn hours into server_hours Format Pt.2', function() {
            var result = Study_Filter.process_hours_into_server_hours("Tuesday", "4:30", "PM");
            var exp = "Tuesday,16:30"
            assert.equal(result, exp);
        });
        it('should turn hours into server_hours Format Pt.3', function() {
            var result = Study_Filter.process_hours_into_server_hours("Sunday", "12:30", "PM");
            var exp = "Sunday,12:30"
            assert.equal(result, exp);
        });
        it('should turn hours into server_hours Format Pt.4', function() {
            var result = Study_Filter.process_hours_into_server_hours("Friday", "08:30", "AM");
            var exp = "Friday,08:30"
            assert.equal(result, exp);
        });
    });

    describe("Server_Hours_To_Hours", function() {
        it('should turn server_hours into Hours Format Pt.1', function() {
            var result = Study_Filter.process_hours_from_server_hours("Tuesday,00:00");
            var exp = ["Tuesday", "12:00", "AM"];
            assert.deepEqual(result, exp);
        });
        it('should turn server_hours into Hours Format Pt.2', function() {
            var result = Study_Filter.process_hours_from_server_hours("Tuesday,16:30");
            var exp = ["Tuesday", "04:30", "PM"];
            assert.deepEqual(result, exp);
        });
        it('should turn server_hours into Hours Format Pt.3', function() {
            var result = Study_Filter.process_hours_from_server_hours("Sunday,12:30");
            var exp = ["Sunday", "12:30", "PM"];
            assert.deepEqual(result, exp);
        });
        it('should turn server_hours into Hours Format Pt.4', function() {
            var result = Study_Filter.process_hours_from_server_hours("Friday,08:30");
            var exp = ["Friday", "08:30", "AM"];
            assert.deepEqual(result, exp);
        });
    });

    describe("Populate Hours", function() {
        it('should populate the hours correctly', function() {
            // see if a set of filter params will accurately populate the options for hours
            global.$ = tools.jqueryFromHtml(
                '<select id="day-from"><option value="Monday"></option>' +
                '<option value="Tuesday"></option></select>' +
                '<select id="hour-from">' +
                '<option value="04:30"></option>' +
                '<option value="02:00"></option>' +
                '</select>' +
                '<select id="ampm-from">' +
                '<option value="AM"></option>' +
                '<option value="PM"></option>' +
                '</select>' +
                '<select id="day-until">' +
                '<option value="Monday"></option>' +
                '<option value="Tuesday"></option>' +
                '</select>' +
                '<select id="hour-until">' +
                '<option value="03:00"></option>' +
                '<option value="05:30"></option>' +
                '</select>' +
                '<select id="ampm-until">' +
                '<option value="AM"></option>' +
                '<option value="PM"></option>' +
                '</select>'
            );
            // before the value should be the first option
            assert.equal($("#day-from").val(), 'Monday');
            var sessionVars = new fakeSess(
                { study_filter_params: '{"open_at":"Tuesday,04:30", "open_until":"Tuesday,05:30"}'}
            );
            global.sessionStorage = sessionVars;
            Study_Filter.populate_hour_filters();
            // all the corresponding values need to be populated!
            assert.equal($("#day-from").val(), "Tuesday");
            assert.equal($("#hour-from").val(), "04:30");
            assert.equal($("#ampm-from").val(), "AM");
            assert.equal($("#day-until").val(), "Tuesday");
            assert.equal($("#hour-until").val(), "05:30");
            assert.equal($("#ampm-until").val(), "AM");
        });
    });

    describe("Get Hours", function() {
        it('should populate the hours correctly', function() {
            // see if the accurate hours are pulled from the HTML
            global.$ = tools.jqueryFromHtml(
                '<select id="day-from">' +
                '<option value="Tuesday" checked="true"></option></select>' +
                '<select id="hour-from">' +
                '<option value="02:00" checked="true"></option>' +
                '</select>' +
                '<select id="ampm-from">' +
                '<option value="AM" checked="true"></option>' +
                '</select>' +
                '<select id="day-until">' +
                '<option value="Tuesday" checked="true"></option>' +
                '</select>' +
                '<select id="hour-until">' +
                '<option value="03:00" checked="true"></option>' +
                '</select>' +
                '<select id="ampm-until">' +
                '<option value="PM" checked="true"></option>' +
                '</select>'
            );
            var sessionVars = new fakeSess();
            var result = Study_Filter.get_processed_hours();
            assert.deepEqual(result, { open_at: 'Tuesday,02:00', open_until: 'Tuesday,15:00' });
        });
    });
});
