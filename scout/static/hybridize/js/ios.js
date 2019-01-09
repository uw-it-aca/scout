// Initialize your hybrid app


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

    // HANDLE USER LOCATION STUFF
    var blah1 = Cookies.get('user_lat');
    var blah2 = Cookies.get('user_lng');
    console.log(blah1 + ", " + blah2);
    $("#hybrid_location_bridge").html(blah1 + ", " + blah2);

    // get the app_type
    var type = $("body").data("app-type")

    if (type.indexOf("food") !== -1) {
        // food
        List.init();
        Filter.init();

    } else if (type.indexOf("study") !== -1){
        // study
        List.init();
        Filter.init();

        // study detail image slider
        if ($( ".photo-gallery").length) {
            $('.photo-gallery').not('.slick-initialized').slick({
                dots: true,
                arrows: false,
            });
        }

    } else if (type.indexOf("tech") !== -1){
        // tech
        List.init();
        Filter.init();
    } else {
        // discover
        Discover.init_cards();
    }

    // filter
    Filter.init_events();

});
