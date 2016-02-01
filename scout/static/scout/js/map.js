// handle map stuff on page load

$(document).on('ready page:load page:restore', function(event) {

	// list map

	if($("#list_map").length > 0) {

        var pos;

		console.log("loading list map");
        // HTML5 geolocation
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function(position) {

                console.log("User shared their location!")

                // user's current location
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

            console.log(pos);
            initializeListMap(pos);

        }, function() {
            console.log("User did not share their location!")

            // seattle fountain
            pos = {
                lat: 47.653811,
                lng: -122.307815
            };

            // center map on seattle fountain
            initializeListMap(pos);

        });
        } else {

            console.log("Browser doens't support geolocation!")

            // seattle fountain
            pos = {
                lat: 47.653811,
                lng: -122.307815
            };

            // center map on seattle fountain
            initializeListMap(pos);
        }

	}

	// detail page map
	if($("#detail_map").length > 0) {

		console.log("loading detail map");
		initializeDetailMap();
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
