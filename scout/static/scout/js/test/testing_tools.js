var jsdom = require('jsdom');
var jquery = require('jquery');

// Used to test the variables stored during the session
var fakeSessionStorage = function fakeSessionStorage(initval){
    if (initval !== undefined) {
        this.sessionVars = initval;
    } else {
        this.sessionVars = {};
    }
};

// Returns the value of the given item, if it doesn't exist, 
// returns null
fakeSessionStorage.prototype.getItem = function(item) {
    var result = this.sessionVars[item];
    if (result === undefined) {
        return null;
    } else {
        return result;
    }
};

// Puts in the sessionVars an item of a certain value
fakeSessionStorage.prototype.setItem = function(item, value) {
    this.sessionVars[item] = value;
};

// Removes the item within the sessionVars
fakeSessionStorage.prototype.removeItem = function(item) {
    delete this.sessionVars[item];
};

// Used in tests files to generate jquery from given html
var jqueryFromHtml = function jqueryFromHtml(html) {
    var doc = jsdom.jsdom(html);
    var win = doc.parentWindow;
    var $ = jquery(win);
    return $;
};

// Used to test the href of the current window/browser
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

// Exporting them so that they may be used in tests
exports.fakeSessionStorage = fakeSessionStorage;
exports.jqueryFromHtml = jqueryFromHtml;
exports.fakeWindow = fakeWindow;
