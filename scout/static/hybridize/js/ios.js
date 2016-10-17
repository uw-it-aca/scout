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
    $("#food_filter_submit").click(function(e) {
        e.preventDefault();
        $.ajax({type: "GET",
            url: "/h/seattle/food/",
            //data: { id: $("#Shareitem").val(), access_token: $("#access_token").val() },
            success:function(result){
                Turbolinks.clearCache();
                Turbolinks.visit("/h/seattle/food/?open_now=true", { action: 'advance' });
            }
        });
    });

    // initialize slick image slider
    $('.photo-gallery').slick({
        dots: true,
        arrows: false,
    });

});
