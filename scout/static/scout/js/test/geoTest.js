var Geolocation = require('../geolocation').Geolocation;
var jsdom = require('jsdom');
var assert = require('assert');
var jquery = require('jquery');
var tools = require('./testing_tools');
var fakeSess = tools.fakeSessionStorage;

describe("Geo Tests", function() {
    describe("Init Location Toggles", function() {
        var sharedPos;
        var defaultPos;
        var forgetLocation;
        var useLocation;
        before(function() {
            global.$ = tools.jqueryFromHtml(
                '<span id="default_position" aria-hidden="false"><span>' +
                '<span></span></span> <span><button id="use_location">' +
                '<i aria-hidden="true"></i></button></span></span>' +
                '<span id="shared_position" aria-hidden="true"><span><span>' +
                '</span></span> <span><button id="forget_location">' +
                '<i aria-hidden="true"></i></button></span></span>'
            );
            // Use this to store the "using_location" variable
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
            assert.equal(global.localStorage.getItem("is_using_location"), true);
        });
        it("should toggle the hidden html correctly when returning to default location", function() {
            forgetLocation.click();
            assert.equal($(sharedPos).attr('aria-hidden'), 'true');
            assert.equal($(defaultPos).attr('aria-hidden'), 'false');
        });
        it("should store the correct using_location variable in local storage when switching back to default location", function() {
            assert.equal(global.localStorage.getItem("is_using_location"), false);
        });
    });
    describe("Display Location Status", function() {
        var sharedPos;
        var defaultPos;
        beforeEach(function() {
            global.$ = tools.jqueryFromHtml(
                '<span id="default_position" aria-hidden="false"><span>' +
                '<span></span></span> <span><button id="use_location">' +
                '<i aria-hidden="true"></i></button></span></span>' +
                '<span id="shared_position" aria-hidden="true"><span><span>' +
                '</span></span> <span><button id="forget_location">' +
                '<i aria-hidden="true"></i></button></span></span>'
            );
            // Use this to store the "location_type" variable
            global.sessionStorage = new fakeSess();
            sharedPos = $("#shared_position");
            defaultPos = $("#default_position");
        });
        it("should correctly toggle hidden html based on a current location_type of user", function() {
            global.sessionStorage.setItem("location_type", "user");
            Geolocation.display_location_status();
            assert.equal($(defaultPos).attr('aria-hidden'), 'true');
            assert.equal($(sharedPos).attr('aria-hidden'), 'false');
        });
        it("should correctly toggle hidden html based on a current location_type of default", function() {
            global.sessionStorage.setItem("location_type", "default");
            Geolocation.display_location_status();
            assert.equal($(defaultPos).attr('aria-hidden'), 'false');
            assert.equal($(sharedPos).attr('aria-hidden'), 'true');
        });
        it("should correctly toggle hidden html based on a current location_type of undefined (default)", function() {
            global.sessionStorage.setItem("location_type", undefined);
            Geolocation.display_location_status();
            assert.equal($(defaultPos).attr('aria-hidden'), 'false');
            assert.equal($(sharedPos).attr('aria-hidden'), 'true');
        });
    });
});
