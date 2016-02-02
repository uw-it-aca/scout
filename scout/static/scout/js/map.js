// handle map stuff on page load

$(document).on('ready page:load page:restore', function(event) {

	// list map... location on list.html and map.html (mobile aned desktop)

	if( $("#list_map").length > 0 ) {

		console.log("loading list map");

        // HTML5 geolocation
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function(position) {

                console.log("User shared their location!")

                // user's current location
                var pos = { lat: position.coords.latitude, lng: position.coords.longitude };

                console.log(pos);
                initializeListMap(pos);

            }, function() {
                console.log("User did not share their location!")

                // seattle fountain
                pos = { lat: 47.653811, lng: -122.307815 };

                // center map on seattle fountain
                initializeListMap(pos);

            });
        } else {

            console.log("Browser doens't support geolocation!")

            // seattle fountain
            pos = { lat: 47.653811, lng: -122.307815 };

            // center map on seattle fountain
            initializeListMap(pos);
        }

	}

	// detail page map
	if($("#detail_map").length > 0) {

		console.log("loading detail map");
		initializeDetailMap();
	}

    // size the map on map.html (mobile only)

    if($(".scout-map #list_map").length > 0) {

        var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-filter-results-container").outerHeight() + $(".scout-footer").outerHeight());
        $("#list_map").height($(window).outerHeight() - offsetHeight);

	}

});


// handle map stuff for window resize

$(window).resize(function() {

	// list map

	if($("#list_map").length > 0) {

		console.log("loading list map");
		initializeListMap();
	}

	// detail page map
	if($("#detail_map").length > 0) {

		console.log("loading detail map");
		initializeDetailMap();
	}

});
