// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks ios fired!");

    /// async load css by flipping the media attribute to all
    $('link[rel="stylesheet"]').attr('media', 'all');

    // discover cards
    Discover.init_cards();

    // initialize framework7
    var myApp = new Framework7({
		router: false,
		fastClicks: true,
		activeState: true,
	});

    // handle closing notifcation banners
    $(".close-notification").click(function(e) {
        e.preventDefault();
        //alert( "Handler for .click() called." );
        myApp.closeNotification(".notification-item")
    });

    // initialize slick image slider
    $('.photo-gallery').slick({
        dots: true,
        arrows: false,
    });


    // handle native submit click from native
    $("#food_filter_submit").click(function(e) {
        // 1. process the web form and generate the query param
        // 2. call the native app and pose the query param as a "message"
        callNativeApp();
    });

    // reset form
    $("#food_filter_clear").click(function(e) {
        $('#food_filter').trigger("reset");
    });

    // testing JS bridge to ios native
    function callNativeApp () {
        try {
            webkit.messageHandlers.foodJsBridge.postMessage("?period0=late_night")
        } catch(err) {
            console.log('The native context does not exist yet');
        }
    }

});
