var Map = {
    get_position: function () {
        var default_position = { latitude: 47.653811, longitude: -122.307815 };

        // set position to default so we have something to use before user accepts
        // sharing of their location (only an issue if they haven't pre-saved an option)
        Map.update_user_position(default_position);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // On user accepting location sharing
                Map.update_user_position(position.coords);
                return { lat: position.coords.latitude, lng: position.coords.longitude };
            }, function() {
                // On error
               Map.update_user_position(default_position);
            });
        }
    },

    get_distance_from_current_position: function (item_position) {
        return Map._get_distance_between_positions(window.user_position, item_position);
    },

    _get_distance_between_positions: function (current_position, item_position) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_position, item_position);
        return distance;
    },

    update_user_position: function (position) {
        var coords = new google.maps.LatLng(position.latitude, position.longitude);
        window.user_position = coords;
        List.update_spots_with_distance();
    },

    init_map: function () {

        //set user position
        Map.get_position();

        // list map... location on list.html and map.html (mobile aned desktop)
        if( $("#list_map").length > 0 ) {
            initializeListMap(window.user_position);
        }

        // detail page map
        if($("#detail_map").length > 0) {
            initializeDetailMap();
        }

        // size the map on map.html (mobile only)
        if($(".scout-map #list_map").length > 0) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-filter-results-container").outerHeight() + $(".scout-footer").outerHeight());
            $("#list_map").height($(window).outerHeight() - offsetHeight);
        }

    },
};


// handle map stuff for window resize

$(window).resize(function() {
	// list map

	if($("#list_map").length > 0) {
		initializeListMap(window.user_position);
	}

	// detail page map
	if($("#detail_map").length > 0) {
		initializeDetailMap();
	}

});


function initializeListMap(pos) {

	var mapExists = document.getElementById("list_map");
	var mapOptions;

	if(mapExists) {

		// center map on center location received from user
		mapCenter = pos;

        mapOptions = {
	        center: mapCenter,
	        zoom: 16,
	    };

        var styles = [
            {
                "featureType": "poi.place_of_worship",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ];

		var map = new google.maps.Map(document.getElementById('list_map'), mapOptions);


        // current location marker
        var locationMarker = new google.maps.Marker({
            position: mapCenter,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#3498db', // red
                fillOpacity: 1,
                strokeColor: '#ffffff',
                scale: 8,
                strokeWeight: 3
            },
        });

        // Add radius overlay and bind to location marker
        var circle = new google.maps.Circle({
            map: map,
            radius: 200,    // 10 miles in metres
            fillColor: '#3498db',
            fillOpacity: 0.1,
            strokeWeight: 0
        });
        circle.bindTo('center', locationMarker, 'position');

        map.setOptions({styles: styles});

        // multiple pins on a single map
        var locations = window.spot_locations;

        var bounds = new google.maps.LatLngBounds();

        // add the marker position to boundary
        bounds.extend(locationMarker.position);

        // create and open InfoWindow.
        var infoWindow = new google.maps.InfoWindow();
        var markers = [];

        $.each(locations, function (key, value){
            var data = value;

			var marker = new MarkerWithLabel({
		        position: new google.maps.LatLng(data.lat, data.lng),
		        map: map,
                //animation: google.maps.Animation.DROP,
                //labelContent: "<i class='fa " + data.icon +"'></i>",
                //labelContent: "<i class='fa " + data.icon +"'></i><span class='marker-text'>" + data.spot_name + "</span>",
                labelAnchor: new google.maps.Point(6, 6),
                labelClass: "map-label", // the CSS class for the label
                icon: {
            		path: google.maps.SymbolPath.CIRCLE,
            		fillColor: '#6564A8',
            		fillOpacity: 1,
            		strokeColor: '#ffffff',
                    scale: 8,
            		strokeWeight: 3
            	},
                //id: data.id,
		    });

            markers.push(marker);

            // attach click event to the marker
            (function (marker, data) {

                google.maps.event.addListener(marker, "click", function (e) {

                    //map.setCenter(marker.getPosition());
                    //map.setZoom(18);

                    //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                    infoWindow.setContent("<div>"+data.spot_name+"<br>"+data.building+"<br><a href='/detail/"+data.id+"'>View details</a></div>");
                    infoWindow.open(map, marker);

                    $('li').css('background', 'none'); // clear any highlighted spots first
                    $('#' + data.id).css('background', '#e8eaf7');
                    $('.scout-scroll').scrollTo('#' + data.id);

                });

                google.maps.event.addListener(infoWindow,'closeclick',function(){
                    $('#' + data.id).css('background', 'none');
                });

                // handle hover event for main list view
                $('#' + data.id).hover(
                    function () {
                        //map.setCenter(marker.getPosition());
                        $('li').css('background', 'none');
                        $(this).css({"background":"#e8eaf7"});
                        infoWindow.setContent("<div>"+data.spot_name+"<br>"+data.building+"</div>");
                        infoWindow.open(map, marker);

                    },
                    function () {
                        $('li').css('background', 'none');
                        infoWindow.close(map, marker);
                    }
                );


            })(marker, data);

            // add the marker position to boundary
            bounds.extend(marker.position);

		});

        // zoom the map automatically using the bounds of all markers
        map.fitBounds(bounds);

        // cluster the markers using marker clusterer
        //var markerCluster = new MarkerClusterer(map, markers);

	}

}
