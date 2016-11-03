// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks ios fired!");

    /// async load css by flipping the media attribute to all
    $('link[rel="stylesheet"]').attr('media', 'all');

    // discover cards
    //Discover.init_cards();

    // initialize framework7
    var myApp = new Framework7({
		router: false,
		fastClicks: true,
		activeState: true,
	});

    // page based JS calls
    var page_path = window.location.pathname;

    if (page_path.indexOf("food") !== -1) {
        // food
        List.init();

    } else if (page_path.indexOf("study") !== -1){
        List.init();
        //Filter.init();

        // initialize slick image slider
        $('.photo-gallery').slick({
            dots: true,
            arrows: false,
        });

    } else if (page_path.indexOf("tech") !== -1){
        List.init();
        //Filter.init();

    } else {
        // discover
        Discover.init_cards();
    }




    // handle closing notifcation banners
    $(".close-notification").click(function(e) {
        e.preventDefault();
        //alert( "Handler for .click() called." );
        myApp.closeNotification(".notification-item")
    });



    // filter
    Filter.init_filter();
    Filter.set_filter_text();

});
