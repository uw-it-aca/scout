// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks android fired!");

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

    // Geolocation
    Geolocation.update_location();

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

    // Geolocation
    Geolocation.update_location();

    // filter
    Filter.init_events();

});
