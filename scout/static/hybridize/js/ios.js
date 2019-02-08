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

    // html5 geolocation
    Geolocation.getLocation();

});
