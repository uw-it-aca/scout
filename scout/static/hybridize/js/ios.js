// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks ios fired!");

    /// async load css by flipping the media attribute to all
    $('link[rel="stylesheet"]').attr('media', 'all');

    // initialize framework7
    var myApp = new Framework7({
		router: false,
		fastClicks: true,
		activeState: true,
	});

    // Include filter js if on filter page
	if(window.location.href.indexOf("/filter/") > -1){
		$.getScript('/static/scout/js/filter.js');
	}

    // handle closing notifcation banners
    $(".close-notification").click(function(e) {
        e.preventDefault();
        //alert( "Handler for .click() called." );
        myApp.closeNotification(".notification-item")
    });

    // handle food filter submit
    /**
    $("#food_filter_submit").click(function(e) {
        e.preventDefault();
        $.ajax({type: "GET",
            url: "/h/seattle/food/",
            success:function(result){
                Turbolinks.clearCache();
                Turbolinks.visit("/h/seattle/food/?period0=late_night", { action: 'advance' });
            }
        });
    });
    **/

    // handle native submit click from native
    $("#food_filter_submit").click(function(e) {
        // 1. process the web form and generate the query param
        // 2. call the native app and pose the query param as a "message"
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
            webkit.messageHandlers.foodJsBridge.postMessage("?period0=late_night")
        } catch(err) {
            console.log('The native context does not exist yet');
        }
    }

});
