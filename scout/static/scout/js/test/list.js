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

describe('Spot list', function() {
    it('should sort spots', function() {
        // Need to wrap our actual list in an element so we can grab
        // the HTML easily
        var inner_init_list = makeFakeList([5, 2.3, 9]);
        var init_list = '<ol id="scout_list">' + inner_init_list + '</ol>';
        var $ = tools.jqueryFromHtml(init_list);
        global.$ = $;
        // Do the sorting
        List.order_spot_list();
        // Get resulting list
        var actual_list = $('#scout_list').html();
        // Make expected result
        var expected_list = makeFakeList([2.3, 5, 9]);
        // Compare
        assert.equal(expected_list, actual_list);
    });
});
