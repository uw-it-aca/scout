// ios initialization

$(document).on('turbolinks:load', function() {

    console.log("turbolinks ios fired!");

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
  		fastClicks: true,
  		activeState: true,
  	});

    /****
    // initialize webview by requesting html5 geolocation
    let foodRe = new RegExp('\/h\/[a-z]+\/food\/');
    let studyRe = new RegExp('\/h\/[a-z]+\/study\/');
    let techRe = new RegExp('\/h\/[a-z]+\/tech\/');
    let discoverRe = new RegExp('\/h\/[a-z]+\/');

    switch(true) {
      case foodRe.test(location.pathname):
        Geolocation.getLocation();
        break;
      case studyRe.test(location.pathname):
        Geolocation.getLocation();
        break;
      case techRe.test(location.pathname):
        Geolocation.getLocation();
        break;
      case discoverRe.test(location.pathname):
        Geolocation.getLocation();
        break;
    }
    ****/

});
