// android initialization

$(document).on('turbolinks:load', function() {

    console.log("turbolinks android fired!");

    // track visits in google analytics
    try{
        ga('send', 'pageview', (location.pathname + location.search));
        console.info("Navigated to: " + location.pathname + location.search);
    }
    catch(e){
        console.log("No ga function, GOOGLE_ANALYTICS_KEY may not be set.");
    };

    // initialize framework7
    var myApp = new Framework7({
      router: false,
      material: true,
      fastClicks: true,
      materialRipple: false,
      activeState: true,
    });

    // initialize webview on main pages only
    let foodRe = new RegExp('\/h\/[a-z]+\/food\/');
    let studyRe = new RegExp('\/h\/[a-z]+\/study\/');
    let techRe = new RegExp('\/h\/[a-z]+\/tech\/');
    let discoverRe = new RegExp('\/h\/[a-z]+\/');

    switch(true) {
      case foodRe.test(location.pathname):
        WebView.initialize();
        break;
      case studyRe.test(location.pathname):
        WebView.initialize();
        break;
      case techRe.test(location.pathname):
        WebView.initialize();
        break;
      case discoverRe.test(location.pathname):
        WebView.initialize();
        break;
    }

    // TESTING: call this function in the console
    // Geolocation.getNativeLocation("47.6592308", "-122.3139863");

});
