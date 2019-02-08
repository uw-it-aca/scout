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

    // get the app_type
    var type = $("body").data("app-type")

    if (type.indexOf("food") !== -1) {
        // food
        // html5 geolocation
        console.log("on food home");
        Geolocation.getLocation();

    } else if (type.indexOf("study") !== -1){
        // study
        // html5 geolocation
        Geolocation.getLocation();


    } else if (type.indexOf("tech") !== -1){
        // tech
        // html5 geolocation
        Geolocation.getLocation();
    } else {
        // discover
        // html5 geolocation
        Geolocation.getLocation();
    }

});
