var jsdom = require('jsdom');
var jquery = require('jquery');

var fakeSessionStorage = function fakeSessionStorage(initval){
    if (initval !== undefined) {
        this.sessionVars = initval;
    } else {
        this.sessionVars = {};
    }
};

fakeSessionStorage.prototype.getItem = function(item) {
    var result = this.sessionVars[item];
    if (result === undefined) {
        return null;
    } else {
        return result;
    }
}

fakeSessionStorage.prototype.setItem = function(item, value) {
    this.sessionVars[item] = value;
}

var jqueryFromHtml = function jqueryFromHtml(html) {
    var doc = jsdom.jsdom(html);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
}

exports.fakeSessionStorage = fakeSessionStorage;
exports.jqueryFromHtml = jqueryFromHtml;