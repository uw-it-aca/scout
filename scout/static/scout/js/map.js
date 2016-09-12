var Map = {

    initialize_resource_map: function() {
        var app_type = {
            "discover_list_map": Map.load_list_map,
            "food_list_map": Map.load_list_map,
            "food_detail_map": Map.load_detail_map,
            "study_list_map": Map.load_list_map,
            "study_detail_map": Map.load_detail_map,
            "tech_list_map": Map.load_list_map,
            "tech_detail_map": Map.load_detail_map
        };

        $.each(app_type, function(resource, map_init){
            if($("#" + resource).length > 0) {
                map_init(resource);
            }
        });
    },

    init_map: function () {
        // handle map stuff for location change
        $(document).ready().on("location_changed", function(){
            Map.initialize_resource_map();
        });
        // handle map stuff for window resize
        //$(window).resize(Map.initialize_resource_map());
    },

    load_map_with_markers: function(map_id, locations){
        var currentMap = document.getElementById(map_id);
        var pos = Geolocation.get_client_latlng();
        var mapOptions;
        if(currentMap) {

            // center map on default location OR location received from user
            mapOptions = {
                center: pos,
                streetViewControl: false,
                zoom: 16
            };

            var styles = [{
                "featureType": "poi.place_of_worship",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }];

            var map = new google.maps.Map(currentMap, mapOptions);

            Map.add_current_position_marker(map, pos);
            map.setOptions({styles: styles});

            // multiple pins on a single map
            var bounds = new google.maps.LatLngBounds();

            // create and open InfoWindow.
            var infoWindow = new google.maps.InfoWindow();
            var markers = [];

            $.each(locations, function (key, data){
                var marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(data.lat, data.lng),
                    map: map,
                    //animation: google.maps.Animation.DROP,
                    labelAnchor: new google.maps.Point(6, 6),
                    labelClass: "map-label",
                    // basic google symbol markers
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

                    marker.addListener("click", function () {
                        var campus = Navigation.get_campus_selection();
                        var app_type = Filter.get_current_type();

                        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                        infoWindow.setContent(
                            "<div><strong>" + data.spot_name + "</strong><br>" +
                            data.building + "</div>"
                        );

                        infoWindow.open(map, marker);

                        // scroll to spot on list
                        List.scroll_to_spot('#' + data.id);

                    });

                    // prevent google maps from being tab navigated
                    map.addListener("tilesloaded", function() {
                        $("#" + map_id +" a").attr("tabindex","-1");
                    });

                    // handle hover event for main list view
                    $('#' + data.id).hover(
                        function () {
                            infoWindow.setContent(
                                "<div><strong>" + data.spot_name + "</strong><br>" +
                                data.building + "</div>"
                            );
                            infoWindow.open(map);
                            infoWindow.setPosition(marker.position);
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
                bounds.extend(window.user_location_marker.position);
                // fit all spots (include user location) onto map
                map.fitBounds(bounds);
            }

            // marker clusterer options
            var mc_options = {
                imagePath: window.staticPath + '/vendor/img/m',
                gridSize: 30,
                minimumClusterSize: 3,
                maxZoom: 20
            };
            // cluster the markers using marker clusterer
            var markerCluster = new MarkerClusterer(map, markers, mc_options);
        }
    },

    load_list_map: function (map_id) {
        var locations = List.get_spot_locations();
        Map.load_map_with_markers(map_id, locations);
    },

    load_discover_map: function (locations) {
        Map.load_map_with_markers("discover_list_map", locations);

    },

    load_detail_map: function(map_id) {
        var currentMap = document.getElementById(map_id);
        var isMobile = $("body").data("mobile");
        var pos = Geolocation.get_client_latlng();
        //myLatlng, mapOptions;

        if (currentMap) {
            // get spot location from data attributes
            var spot_lat = $(".scout-card").data("latitude");
            var spot_lng = $(".scout-card").data("longitude");
            var spot_name = $(".scout-card").data("spotname");
            var spot_building = $(".scout-card").data("building");
            var spotPosition, mapOptions;

            // center map direction on spot location
            spotPosition = new google.maps.LatLng(spot_lat, spot_lng);
            // set map options based on mobile or desktop
            if (isMobile !== undefined ) {
                mapOptions = {
                    center: spotPosition,
                    zoom: 18,
                    scrollwheel: false,
                    draggable: false,
                    disableDefaultUI: true,
                    zoomControl: false,
                    disableDoubleClickZoom: true
                };
            } else {
                mapOptions = {
                    center: spotPosition,
                    zoom: 19,
                    streetViewControl: false,
                };
            }

            var styles = [{
                "featureType": "poi.place_of_worship",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.business",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.school",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            }];

            var map = new google.maps.Map(currentMap, mapOptions);

            Map.add_current_position_marker(map, pos);
            map.setOptions({styles: styles});

            // create and open InfoWindow... links to google maps walking directions
            var contentString =
                "<div><strong>" + spot_name + "</strong><br>" + spot_building +
                "<br/><a href='//maps.google.com/maps?daddr=" + spot_lat + "," + spot_lng +
                "&saddr=" + pos.lat() + "," + pos.lng() +
                "&dirflg=w' target='_blank'>Get walking directions</a></div>";

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var marker = new MarkerWithLabel({
                position: spotPosition,
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
                // zoom the map automatically using the bounds of all markers
                var bounds = new google.maps.LatLngBounds();
                // add the marker position to boundary
                bounds.extend(marker.position);
                window.map_bounds = bounds;
                // Don't store user marker in bounds as it can change
                bounds.extend(window.user_location_marker.position);
                // fit all spots (include user location) onto map
                map.fitBounds(bounds);
            }
        }
    },

     add_current_position_marker: function (map, pos) {
        var lastZoom = 18;
        var circle;
        var rMin = 1, rMax = 30, step = 1;
        var intID;

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
                }
            });
            window.user_location_marker = locationMarker;

            circle = new google.maps.Circle({
                map: map,
                radius: rMax,    // meters
                fillColor: '#c0392b',
                fillOpacity: 0.15,
                strokeWeight: 0
            });
            circle.bindTo('center', locationMarker, 'position');

            setAnimation();

            google.maps.event.addListener(map, 'zoom_changed', function() {
                clearInterval(intID);

                var zoom = map.getZoom();

                if (zoom > lastZoom) {
                    rMax /= 2;
                    rMin /= 2;
                    step /= 2;
                } else {
                    rMax *= 2;
                    rMin *= 2;
                    step *= 2;
                }
                lastZoom = zoom;

                circle.setRadius(rMax);
                setAnimation();
            });
        }


        function setAnimation() {
            var direction = 1;
            intID = setInterval(function() {
                var radius = circle.getRadius();
                if ((radius > rMax) || (radius < rMin)) {
                    direction *= -1;
                }
                circle.setRadius(radius + direction * step);
            }, 30);
        }
    }

};
