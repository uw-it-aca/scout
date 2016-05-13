var Geolocation = require('../geolocation').Geolocation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeSess = require('./testing_tools').fakeSessionStorage;

describe("Geo Tests", function() {
    describe("Init Location Toggles", function() {
        var sharedPos;
        var defaultPos;
        var forgetLocation;
        var useLocation;
        before(function() {
            global.$ = tools.jqueryFromHtml( 
                '<span id="default_position" aria-hidden="false"><span> <span></span></span> <span><button id="use_location"><i aria-hidden="true"></i></button></span></span> <span id="shared_position" aria-hidden="true"><span><span></span></span> <span><button id="forget_location"><i aria-hidden="true"></i></button></span></span>'
            );
            global.localStorage = new fakeSess();
            sharedPos = $("#shared_position");
            defaultPos = $("#default_position");
            forgetLocation = $("#forget_location");
            useLocation = $("#use_location");
            Geolocation.init_location_toggles();
        });
        it("should toggle the hidden html correctly when using user's location", function() {
            useLocation.click();
            assert.equal($(sharedPos).attr('aria-hidden'), 'false');
            assert.equal($(defaultPos).attr('aria-hidden'), 'true');
        });
        it("should store the correct using_location variable in local storage when using user's location", function() {
            assert.equal(global.localStorage.getItem("using_location"), true);
        });
        it("should toggle the hidden html correctly when returning to default location", function() {
            forgetLocation.click();
            assert.equal($(sharedPos).attr('aria-hidden'), 'true');
            assert.equal($(defaultPos).attr('aria-hidden'), 'false');
        });
        it("should store the correct using_location variable in local storage when switching back to default location", function() {
            assert.equal(global.localStorage.getItem("using_location"), false);
    
        });
    });
});
