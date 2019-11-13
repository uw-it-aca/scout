var WebView = {
  render: function(hlat, hlng) {
    // make sure user coords are passed.. if not, specify default location
    if (hlat && hlng) {
      // update location display
      //$("#hybrid_location_bridge").html(hlat + ",   " + hlng);

      Geolocation.getReverseGeocodingData(hlat, hlng);
      $("#user_location").show();
    } else {
      $("#geodemo").html("Default location");
      $("#default_location").show();
    }

    // initialize webview of main landing pages
    var detailRe = new RegExp("/h/[a-z]+/[a-z]+/[0-9]+/");
    var foodRe = new RegExp("/h/[a-z]+/food/");
    var studyRe = new RegExp("/h/[a-z]+/study/");
    var techRe = new RegExp("/h/[a-z]+/tech/");
    var discoverRe = new RegExp("/h/[a-z]+/");

    switch (true) {
      case detailRe.test(location.pathname):
        break;
      case foodRe.test(location.pathname):
        List.init(hlat, hlng);
        Filter.init();
        //Filter.init_events();
        break;
      case studyRe.test(location.pathname):
        List.init(hlat, hlng);
        Filter.init();
        Study_Filter.init_events();
        break;
      case techRe.test(location.pathname):
        List.init(hlat, hlng);
        Filter.init();
        //Filter.init_events();
        break;
      case discoverRe.test(location.pathname):
        Discover.init_cards(hlat, hlng);
        break;
    }
  },

  initialize: function() {
    var message = "renderWebview";

    // get the device type
    var device = $("body").data("device");

    try {
      // check device and handle js bridge accordingly
      if (device == "android") {
        scoutBridge.setParams(message);
      } else if (device == "ios") {
        webkit.messageHandlers.scoutBridge.postMessage(message);
      }
    } catch (err) {
      // no bridge could be found (usually when on localhost webview only)
      // call the getNativeLocation function that normally gets called
      // from native apps only
      Geolocation.getNativeLocation();
      //Geolocation.getNativeLocation("47.6580207", "-122.3075315");
    }
  }
};
