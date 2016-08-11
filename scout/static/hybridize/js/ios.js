// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks fired!");

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
    $("#food_filter_submit").click(function(e) {
        e.preventDefault();
        history.back(1);
        Turbolinks.clearCache();
    });

});
