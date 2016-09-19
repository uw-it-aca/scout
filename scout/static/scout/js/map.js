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
        Map.initialize_resource_map();

        $(document).ready().on("location_changed", function(){
            Map.handle_location_update();
        });
        // handle map stuff for window resize
        //$(window).resize(Map.initialize_resource_map());
    },

    handle_location_update: function() {
        Map.add_current_position_marker(window.map_object,
                                        Geolocation.get_client_latlng());
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
            var oms = new OverlappingMarkerSpiderfier(map, {keepSpiderfied: true, circleFootSeparation: 46});

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
                    spot: {
                        id: data.id,
                        name: data.spot_name,
                        building: data.building,
                        items: data.items
                    }
                });

                markers.push(marker);
                oms.addMarker(marker);

                // prevent google maps from being tab navigated
                map.addListener("tilesloaded", function() {
                    $("#" + map_id +" a").attr("tabindex","-1");
                });

                // handle hover event for main list view
                $('#' + data.id).hover(
                    function () {
                        // hover IN
                        infoWindow.setContent(
                            "<div><strong>" + data.spot_name + "</strong><br>" +
                            data.building + "</div>"
                        );
                        infoWindow.open(map);
                        infoWindow.setPosition(marker.position);
                        if (map.getZoom() != 16){
                            map.setZoom(16); //default zoom level
                        }
                        map.setCenter(marker.getPosition());
                    },
                    function () {
                        // hover OUT
                        infoWindow.close(map, marker);
                    }
                );

                // add the marker position to boundary
                bounds.extend(marker.position);

            });
            // attach events to markers
            oms.addListener("click", function (marker, event) {
                var campus = Navigation.get_campus_selection();
                var app_type = Filter.get_current_type();

                //Wrap the   content inside an HTML DIV in order to set height and width of InfoWindow.
                if (app_type !== "/tech/"){
                    infoWindow.setContent(
                        "<div><strong>" + marker.spot.name + "</strong><br>" +
                        marker.spot.building + "<br>" +
                        "<a href='/" + campus + app_type + marker.spot.id + "/'>View details</a>" +
                        "</div>"
                    );
                } else {
                    infoWindow.setContent(
                        "<div><strong>" + marker.spot.name + "</strong><br>" +
                        marker.spot.building + "<br>" +
                        marker.spot.items + " items <br>" +
                        "</div>"
                    );
                }

                infoWindow.open(map, marker);

                // scroll to spot on list
                //console.log('scroll to ' + data.id);
                List.scroll_to_spot('#' + marker.spot.id);

            });

            // zoom the map automatically using the bounds of all markers
            window.map_bounds = bounds;
            if (Geolocation.get_location_type() !== "default") {
                Map.add_current_position_marker(map, pos);
            } else {
                map.fitBounds(bounds);
            }
            window.map_object = map;

            // marker clusterer options
            var mc_options = {
                imagePath: window.staticPath + '/vendor/img/m',
                gridSize: 30,
                minimumClusterSize: 2,
                maxZoom: 18
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
                    zoom: 18,
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

            map.setOptions({styles: styles});

            // create and open InfoWindow... links to google maps walking directions
            var contentString =
                "<div><strong>" + spot_name + "</strong><br>" + spot_building +
                "<br/><a href='//maps.google.com/maps?daddr=" + spot_lat + "," + spot_lng +
                "&dirflg=w' target='_blank'>Get walking directions</a></div>";

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var app_type = Filter.get_current_type();
            var labelContent;

            if (app_type == '/food/'){
                labelContent = "<i class='fa fa-cutlery'></i><span class='marker-text' style='margin-left:15px;font-size:12px;'>" + spot_name + "</span>";
            } else if(app_type == '/study/'){
                labelContent = "<i class='fa fa-graduation-cap'></i><span class='marker-text' style='margin-left:15px;font-size:12px;'>" + spot_name + "</span>";
            } else if(app_type == '/tech/'){
                labelContent = "<i class='fa fa-laptop'></i><span class='marker-text' style='margin-left:15px;font-size:12px;'>" + spot_name + "</span>";
            }

            var marker = new MarkerWithLabel({
                position: spotPosition,
                map: map,
                title: spot_name,
                labelContent: labelContent,
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
            // add the marker position to boundary
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(marker.position);
            window.map_bounds = bounds;
            map.fitBounds(bounds);

            if (Geolocation.get_location_type() !== "default") {
                Map.add_current_position_marker(map, pos);
            }
            window.map_object = map;
        }
    },

    add_current_position_marker: function (map, pos) {
        // show user location marker if user is sharing
        if (Geolocation.get_location_type() !== "default") {
            // create or update position of marker for user location
            if (window.user_location_marker !== undefined){
                window.user_location_marker.setPosition(pos);
            } else {
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
            }
            // Resize bounds to include user location
            var bounds = window.map_bounds;
            bounds.extend(window.user_location_marker.position);
            map.fitBounds(bounds);
        }


    }

};
