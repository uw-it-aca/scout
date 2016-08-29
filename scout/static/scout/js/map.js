var Map = {

    init_map: function () {
        $(document).on("location_changed", function() {

            // food list map
            if( $("#food_list_map").length > 0) {
                var map_id = 'food_list_map';
                Map.load_list_map(map_id);
            }
            //food detail map
            if($("#food_detail_map").length > 0) {
                var map_id = 'food_detail_map';
                Map.load_detail_map(map_id);
            }
            // study list map
            if( $("#study_list_map").length > 0 ) {
                var map_id = 'study_list_map';
                Map.load_list_map(map_id);
            }
            // study detail map
            if( $("#study_detail_map").length > 0 ) {
                var map_id = 'study_detail_map';
                Map.load_detail_map(map_id);
            }

            // tech list map
            if( $("#tech_list_map").length > 0 ) {
                var map_id = 'tech_list_map';
                Map.load_list_map(map_id);
            }
            // tech detail map
            if( $("#tech_detail_map").length > 0 ) {
                var map_id = 'tech_detail_map';
                Map.load_detail_map(map_id);
            }

            // discover map
            if( $("#discover_list_map").length > 0 ) {
                var map_id = 'discover_list_map';
                Map.load_list_map(map_id);
            }

        });

        // handle map stuff for window resize
        $(window).resize(function() {

            // food list map
            if($("#food_list_map").length > 0) {
                var map_id = 'food_list_map';
                Map.load_list_map(map_id);
            }
            // food detail map
            if($("#food_detail_map").length > 0) {
                var map_id = 'food_detail_map';
                Map.load_detail_map(map_id);
            }
            // study list map
            if( $("#study_list_map").length > 0 ) {
                var map_id = 'study_list_map';
                Map.load_list_map(map_id);
            }
            // study detail map
            if( $("#study_detail_map").length > 0 ) {
                var map_id = 'study_detail_map';
                Map.load_detail_map(map_id);
            }
            // tech list map
            if( $("#tech_list_map").length > 0 ) {
                var map_id = 'tech_list_map';
                Map.load_list_map(map_id);
            }
            // tech detail map
            if( $("#tech_detail_map").length > 0 ) {
                var map_id = 'tech_detail_map';
                Map.load_detail_map(map_id);
            }

            // discover map
            if( $("#discover_list_map").length > 0 ) {
                var map_id = 'discover_list_map';
                Map.load_list_map(map_id);
            }

        });
    },

    init_map_page: function () {
        //Geolocation.init_location_toggles();
    },

    load_list_map: function (map_id) {
        var mapExists = document.getElementById(map_id);
        var pos = Geolocation.get_client_latlng();
        var mapOptions;
        if(mapExists) {

            console.log("map exists");

            // center map on default location OR location received from user
            mapCenter = pos;
            mapOptions = {
                center: mapCenter,
                streetViewControl: false,
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
            var map = new google.maps.Map(document.getElementById(map_id), mapOptions);

            // show user location marker if user is sharing
            if (Geolocation.get_location_type() !== "default") {
                // create a marker for user location
                var locationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#ffffff',
                        fillOpacity: 1,
                        strokeColor: '#c0392b',
                        scale: 5,
                        strokeWeight: 5
                    },
                });

                // add radius overlay and bind to user location marker
                var circle = new google.maps.Circle({
                    map: map,
                    radius: 40,    // meters
                    fillColor: '#c0392b',
                    fillOpacity: 0.15,
                    strokeWeight: 0
                });
                circle.bindTo('center', locationMarker, 'position');

                // pulsate the radius overlay
                var direction = 1;
                var rmin = 20, rmax = 30;
                setInterval(function() {
                    var radius = circle.getRadius();
                    if ((radius > rmax) || (radius < rmin)) {
                        direction *= -1;
                    }
                    circle.setRadius(radius + direction * 10);
                }, 400);

                // add user location marker to map
                window.user_location_marker = locationMarker;

            }

            map.setOptions({styles: styles});

            // multiple pins on a single map
            var locations = List.get_spot_locations();
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
                    labelAnchor: new google.maps.Point(6, 6),
                    labelClass: "map-label", // the CSS class for the label

                    // basic google sympbol markers
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#ffffff',
                        fillOpacity: 1,
                        strokeColor: '#6564A8',
                        scale: 5,
                        strokeWeight: 5
                    },

                });

                markers.push(marker);

                // attach events to markers
                (function (marker, data) {

                    google.maps.event.addListener(marker, "click", function (e) {
                        var campus = Navigation.get_campus_selection();

                        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                        infoWindow.setContent("<div><strong>"+data.spot_name+"</strong><br>"+data.building+"<br><a href='/" + campus + "/food/"+data.id+"'>View details</a></div>");
                        infoWindow.open(map, marker);

                        // scroll to spot on list
                        List.scroll_to_spot('#' + data.id);

                    });

                    google.maps.event.addListener(infoWindow,'closeclick',function(){
                        $('#' + data.id).css('background', 'none');
                    });

                    // prevent google maps from being tab navigated
                    google.maps.event.addListener(map, "tilesloaded", function(){
                        $("#" + map_id +" a").attr("tabindex","-1");
                    });

                    // handle hover event for food/study list view
                    $('#' + data.id).hover(
                        function () {
                            //map.setCenter(marker.getPosition());
                            infoWindow.setContent("<div><strong>"+data.spot_name+"</strong><br>"+data.building+"</div>");
                            infoWindow.open(map, marker);

                        },
                        function () {
                            infoWindow.close(map, marker);
                        }
                    );


                })(marker, data);

                // add the marker position to boundary
                bounds.extend(marker.position);

            });

            // zoom the map automatically using the bounds of all markers
            window.map_bounds = bounds;

            if (Geolocation.get_location_type() !== "default") {
                // Don't store user marker in bounds as it can change
                bounds.extend(locationMarker.position);
                // fit all spots (include user location) onto map
                map.fitBounds(bounds);
            }

            // marker clusterer options
            var mc_options = {
                imagePath: '/static/vendor/img/m',
                gridSize: 30,
                minimumClusterSize: 3,
                maxZoom: 20
            };
            // cluster the markers using marker clusterer
            var markerCluster = new MarkerClusterer(map, markers, mc_options);

            window.map = map;
        }
    },

    load_detail_map: function(map_id) {
        var mapExists = document.getElementById(map_id);
        var isMobile = $("body").data("mobile");
        var myLatlng, mapOptions;
        var pos = Geolocation.get_client_latlng();

        if (mapExists) {

            // get spot location from data attributes
            var spot_lat = $(".scout-card").data("latitude");
            var spot_lng = $(".scout-card").data("longitude");
            var spot_name = $(".scout-card").data("spotname");
            var spot_building = $(".scout-card").data("building");

            // center map direction on spot location
            myLatlng = new google.maps.LatLng(spot_lat, spot_lng);

            // set map options based on mobile or desktop
            if (isMobile !== undefined ) {

                mapOptions = {
                    center: myLatlng,
                    zoom: 18,
                    scrollwheel: false,
                    draggable: false,
                    disableDefaultUI: true,
                    zoomControl: false,
                    disableDoubleClickZoom: true
                };

            }
            else {

                mapOptions = {
                    center: myLatlng,
                    zoom: 19,
                    streetViewControl: false,
                };

            }

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
                },
                {
                    "featureType": "poi.school",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ];

            var map = new google.maps.Map(document.getElementById(map_id), mapOptions);

            // show user location marker if user is sharing
            if (Geolocation.get_location_type() !== "default") {
                // create a marker for user location
                var locationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#ffffff',
                        fillOpacity: 1,
                        strokeColor: '#c0392b',
                        scale: 5,
                        strokeWeight: 5
                    },
                });

                // add radius overlay and bind to user location marker
                var circle = new google.maps.Circle({
                    map: map,
                    radius: 40,    // meters
                    fillColor: '#c0392b',
                    fillOpacity: 0.15,
                    strokeWeight: 0
                });
                circle.bindTo('center', locationMarker, 'position');

                // pulsate the radius overlay
                var direction = 1;
                var rmin = 20, rmax = 30;
                setInterval(function() {
                    var radius = circle.getRadius();
                    if ((radius > rmax) || (radius < rmin)) {
                        direction *= -1;
                    }
                    circle.setRadius(radius + direction * 10);
                }, 500);

                // add user location marker to map
                window.user_location_marker = locationMarker;

            }

            map.setOptions({styles: styles});

            // create and open InfoWindow.
            var contentString = "<div><strong>"+spot_name+"</strong><br>"+spot_building+"<br/><a href='//maps.google.com/maps?q="+spot_lat+","+spot_lng+"' target='_blank'>Get directions</a></div>";

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new MarkerWithLabel({
                position: myLatlng,
                map: map,
                title: spot_name,
                labelContent: "<i class='fa fa-cutlery'></i><span class='marker-text' style='margin-left:15px;font-size:12px;'>" + spot_name + "</span>",
                labelAnchor: new google.maps.Point(6, 6),
                labelClass: "map-label", // the CSS class for the label
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#53518e',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 15
                }
            });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            if (Geolocation.get_location_type() !== "default") {

                var bounds = new google.maps.LatLngBounds();
                // zoom the map automatically using the bounds of all markers

                // add the marker position to boundary
                bounds.extend(marker.position);

                window.map_bounds = bounds;

                // Don't store user marker in bounds as it can change
                bounds.extend(locationMarker.position);
                // fit all spots (include user location) onto map
                map.fitBounds(bounds);
            }


        }

    },

};
