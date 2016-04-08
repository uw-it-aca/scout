// Initialize your app


$(document).on('turbolinks:load', function() {

    console.log("turbolinks fired!");

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
	if(window.location.href.indexOf("/filter/") > -1){
		$.getScript('/static/scout/js/filter.js');
	}


});
