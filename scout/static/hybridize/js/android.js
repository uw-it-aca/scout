// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks android fired!");

    /// async load css by flipping the media attribute to all
    $('link[rel="stylesheet"]').attr('media', 'all');

    // discover cards
    Discover.init_cards();

    // initialize framework7
    var myApp = new Framework7({
	    router: false,
		material: true,
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

    // filter
    Filter.init_filter();

});
