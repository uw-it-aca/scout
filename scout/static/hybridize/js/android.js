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

    $("#food_filter_submit").click(function(e) {
        callNativeApp();
    });

    // initialize slick image slider
    $('.photo-gallery').slick({
        dots: true,
        arrows: false,
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
