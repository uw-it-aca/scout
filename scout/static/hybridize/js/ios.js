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

    var query;

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


    /***** JS Bridge Handling ******/

    // handle native submit click from native
    $("#filter_submit").click(function(e) {
        // 1. process the web form and generate the query param
        // 2. call the native app and pose the query param as a "message"
        query = "?period0=late_night"
        callScoutBridge(query);
    });

    // reset form
    $('#filter_clear').click(function(e) {
        $('#scout_filter').trigger("reset");
        $('#scout_filter input:checkbox').removeAttr('checked');
        $('#scout_filter input:radio').removeAttr('checked');

        // TODO: make sure query param is cleared out before
        query = ""
        callScoutBridge(query);

    });

    $('#scout_filter li').each(function () {
        $(this).click(function () {
            // TODO: process the input and rebuild the query param
            query = "?period0=late_night"
            callScoutBridge(query);

        })
    });

    // testing JS bridge to ios native
    function callScoutBridge(query_param) {
        try {
            webkit.messageHandlers.scoutBridge.postMessage(query)
        } catch(err) {
            console.log('The native context does not exist yet');
        }
    }

});
