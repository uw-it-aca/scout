var List = require('../list').List;
var assert = require('assert');
var tools = require('./testing_tools');

var makeFakeList = function(distances) {
    var fakeListSection = function(dist) {
        var out = '<li class="scout-list-item">';
        out += '<span class="distance-number">';
        out += String(dist);
        out += '</span></li>';
        return out;
    };
    var full_html = '';
    for (i = 0; i < distances.length; i++) {
        dist = distances[i];
        full_html += fakeListSection(dist);
    }
    return full_html;
};

describe('List Food Tests', function() {
    describe('Order Food Spot List', function() {
        it('should sort food spots that need to be sorted', function() {
            // Need to wrap our actual list in an element so we can grab
            // the HTML easily
            var inner_init_list = makeFakeList([5, 2.3, 9, 1.1]);
            var init_list = '<ol id="scout_food_list">' + inner_init_list + '</ol>';
            var $ = tools.jqueryFromHtml(init_list);
            global.$ = $;
            // Do the sorting
            List.order_spot_list();
            // Get resulting list
            var actual_list = $('#scout_food_list').html();
            // Make expected result
            var expected_list = makeFakeList([1.1, 2.3, 5, 9]);
            // Compare
            assert.equal(expected_list, actual_list);
        });
        it('should not do anything to an empty list of food spots', function() {
            // Need to wrap our actual list in an element so we can grab
            // the HTML easily
            var init_list = '<ol id="scout_food_list"></ol>';
            var $ = tools.jqueryFromHtml(init_list);
            global.$ = $;
            // Do the sorting
            List.order_spot_list();
            // Get resulting list
            var actual_list = $('#scout_food_list').html();
            // Make expected result
            var expected_list = makeFakeList([]);
            // Compare
            assert.equal(expected_list, actual_list);
        });
    });
});
