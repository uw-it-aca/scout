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
		activeState: true,
	});

    // Include filter js if on filter page
    /**
	if(window.location.href.indexOf("/filter/") > -1){
		$.getScript('/static/scout/js/filter.js');
	}**/

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

    $("#food_filter_submit").click(function(e) {
        // 1. process the web form and generate the query param
        // 2. call the native app and pose the query param as a "message"
        callNativeApp();
    });

    // testing JS bridge to ios native
    function callNativeApp () {
        try {
            webkit.messageHandlers.foodJsBridge.postMessage("Hello from curry!")
        } catch(err) {
            console.log('The native context does not exist yet');
        }
    }

});
