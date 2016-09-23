var List = require('../list').List;
var assert = require('assert');
var tools = require('./testing_tools');

var makeFakeList = function(distances) {
    var fakeListSection = function(dist) {
        var out = '<li class="scout-list-item" data-spot-distance="' + String(dist) + '">';
        out += '<span class="distance-number">';
        out += String(dist);
        out += '</span></li>';
        return out;
    };
    var full_html = [];
    for (i = 0; i < distances.length; i++) {
        dist = distances[i];
        var jquery_object = tools.jqueryFromHtml(fakeListSection(dist));
        full_html.push(fakeListSection(dist));
    }
    return full_html;
};

var getDistances = function(spots) {
    sorted_distances = []
    for (i = 0; i < spots.length; i++ ){
        spot = spots[i];
        var distance = parseFloat($(spot).attr('data-spot-distance'));
        sorted_distances.push(distance)
    }
    return sorted_distances;

};

describe('List Food Tests', function() {
    describe('Order Food Spot List', function() {
        it('should sort food spots that need to be sorted', function() {
            // Generating a list of spot objects with the following distances
            var spots = makeFakeList([5, 2.3, 9, 1.1]);
            // Do the sorting
            sorted_spots = List.sort_spots_by_distance(spots);
            // Get resulting distances from the spots
            sorted_distances = getDistances(sorted_spots);
            var expected_list = [1.1, 2.3, 5, 9];
            // Compare
            assert.deepEqual(sorted_distances, expected_list);
        });
        it('should not do anything to an empty list of food spots', function() {
            // Need to wrap our actual list in an element so we can grab
            // the HTML easily
            var init_list = '<ol id="scout_food_list"></ol>';
            var $ = tools.jqueryFromHtml(init_list);
            global.$ = $;
            // Do the sorting
            List.order_list("scout-list-item", "scout_food_list", false);
            // Get resulting list
            var actual_list = $('#scout_food_list').html();
            // Make expected result
            var expected_list = makeFakeList([]);
            // Compare
            assert.equal(actual_list, expected_list);
        });
    });
});
