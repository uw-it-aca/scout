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
};

fakeSessionStorage.prototype.setItem = function(item, value) {
    this.sessionVars[item] = value;
};

fakeSessionStorage.prototype.removeItem = function(item) {
    // is this the best way to delte 
    delete this.sessionVars[item];
};

var jqueryFromHtml = function jqueryFromHtml(html) {
    var doc = jsdom.jsdom(html);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
};

var fakeWindow = function fakeWindow(initHref) {
    this.location = {};
    if (initHref !== undefined) {
        this.location.href = initHref;
    } else {
        this.location.href = "";
    }
    this.location.replace = function(new_loc) {
        this.href = new_loc;
    };

};


exports.fakeSessionStorage = fakeSessionStorage;
exports.jqueryFromHtml = jqueryFromHtml;
exports.fakeWindow = fakeWindow;
