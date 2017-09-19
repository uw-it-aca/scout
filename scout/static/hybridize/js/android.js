// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks android fired!");

    // track visits in google analytics
    try {
        ga('send', 'pageview', (location.pathname + location.search));
        console.info("Navigated to: " + location.pathname + location.search);
    } catch(e){
        console.log("No ga function, GOOGLE_ANALYTICS_KEY may not be set.");
    }

    /// async load css by flipping the media attribute to all
    $('link[rel="stylesheet"]').attr('media', 'all');

    // initialize framework7
    var myApp = new Framework7({
	    router: false,
		material: true,
		fastClicks: true,
        materialRipple: false,
		activeState: true,
	});

    // get the app_type
    var type = $("body").data("app-type");
    var limit = List.get_limit_param(type);

    if (type == "food") {
        if (LIST_PAGE == true) {
            // food list
            // initialize limit
            if (limit === undefined || limit === null) {
                limit = 20;
            }
            List.fetch_spot_list(100000, limit, "scout_food_list", function() {
                List.init();
                Filter.init();
            });
        }
    } else if (type == "study") {
        if (LIST_PAGE == true) {
            // study list
            // initialize limit
            if (limit === undefined || limit === null) {
                limit = 20;
            }
            List.fetch_spot_list(100000, limit, "scout_study_list", function() {
                List.init();
                Filter.init();
            });
        } else {
            // study detail
            // image slider
            if ($( ".photo-gallery").length) {
                $('.photo-gallery').not('.slick-initialized').slick({
                    dots: true,
                    arrows: false,
                });
            }
        }
    } else if (type === "tech") {
        if (LIST_PAGE == true) {
            // tech list
            // initialize limit
            if (limit === undefined || limit === null) {
                limit = 20;
            }
            List.fetch_spot_list(100000, limit, "scout_tech_list", function() {
                List.init();
                Filter.init();
            });
        }
    } else {
        // discover
        Discover.init_cards();
    }

    // Geolocation
    //Geolocation.update_location();

    // filter
    Filter.init_events();

});
