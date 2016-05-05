var jsdom = require('jsdom');
var jquery = require('jquery');

var jqueryFromHtml = function jqueryFromHtml(html) {
    var doc = jsdom.jsdom(html);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
}




exports.jqueryFromHtml = jqueryFromHtml;
