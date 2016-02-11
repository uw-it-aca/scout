var Map = {
    default_position: { latitude: 47.653811, longitude: -122.307815 },

    get_position: function (update_callback) {
        // Use a session cookie to store user's location, prevent querying for
        // geolocation permission if cookie is set
        if (Cookies.get('user_position') === undefined){
            Map.update_user_position(Map.default_position, update_callback, false);
            // set position to default so we have something to use before user accepts
            // sharing of their location (only an issue if they haven't pre-saved an option)
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // On user accepting location sharing
                    Map.update_user_position(position.coords, update_callback, true);
                });
            }
        } else {
            if (typeof update_callback === 'function') {
                update_callback();
            }
        }
    },

    get_latlng: function () {
        var cookie_data = Cookies.get('user_position');
        if(cookie_data === undefined){
            return new google.maps.LatLng(Map.default_position.latitude, Map.default_position.longitude);
        } else {
            var data = JSON.parse(cookie_data);
            return new google.maps.LatLng(data.latitude, data.longitude);
        }
    },

    get_distance_from_current_position: function (item_position) {
        var distance = Map._get_distance_between_positions(Map.get_latlng(), item_position);
        // Distance in feet
        Math.round(distance * 3.280839895);
        return distance;
    },

    _get_distance_between_positions: function (current_position, item_position) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(current_position, item_position);
        return distance;
    },

    update_user_position: function (position, update_callback, is_real_position) {
        if(is_real_position){
            Cookies.set('user_position', {'latitude': position.latitude,
                                      'longitude': position.longitude});
        }
        // Run the update callback of it's passed
        if (typeof update_callback === 'function') {
            update_callback();
        }
    },

    update_list_map: function () {
        List.update_spots_with_distance();
        Map.update_map(Map.get_latlng());
    },

    init_map: function () {
        // list map... location on list.html and map.html (mobile aned desktop)
        if( $("#list_map").length > 0 ) {
            Map.get_position(Map.update_list_map);
            //Map.initializeListMap(Map.get_latlng());
        }

         //detail page map
        if($("#detail_map").length > 0) {
            Map.get_position();
            initializeDetailMap();
        }

    },

    update_map: function(position) {
        // Updates the map on resize or re-centers if client position changes
        if(window.map !== undefined) {
            window.user_location_marker.setPosition(position);

            //Add user position to marker bounds and re-fit
            var bounds = window.map_bounds;
            bounds.extend(position);
            window.map.fitBounds(bounds);

        } else {
            Map.initializeListMap(position);
        }
    },

    initializeListMap: function (pos) {
        var mapExists = document.getElementById("list_map");
        var mapOptions;

        if(mapExists) {
            // center map on center location received from user
            mapCenter = pos;

            mapOptions = {
                center: mapCenter,
                zoom: 16
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
                position: pos,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3498db',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    scale: 6,
                    strokeWeight: 2
                },
            });

            // Add radius overlay and bind to location marker
            var circle = new google.maps.Circle({
                map: map,
                radius: 200,    // 10 miles in metres
                fillColor: '#2980b9',
                fillOpacity: 0.1,
                strokeWeight: 0
            });
            circle.bindTo('center', locationMarker, 'position');

            window.user_location_marker = locationMarker;
            map.setOptions({styles: styles});

            // multiple pins on a single map
            var locations = window.spot_locations;

            var bounds = new google.maps.LatLngBounds();

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
                        strokeWeight: 2
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
            window.map_bounds = bounds;
            // Don't store user marker in bounds as it can change
            bounds.extend(locationMarker.position);
            map.fitBounds(bounds);

            // cluster the markers using marker clusterer
            //var markerCluster = new MarkerClusterer(map, markers);
            window.map = map;
        }
    }
};


// handle map stuff for window resize

$(window).resize(function() {
	// list map
	if($("#list_map").length > 0) {
		Map.update_map(Map.get_latlng());
	}
	// detail page map
	if($("#detail_map").length > 0) {
		initializeDetailMap();
	}
});
