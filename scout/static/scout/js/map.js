var Map = {

    init_map: function () {
        $(document).on("location_changed", function() {

            // food list map
            if( $("#list_map").length) {
                console.log("food list map initilaized");
                Map.initializeListMap();
            }
            //detail page map
            if($("#detail_map").length > 0) {
                console.log("food detail map initilaized");
                Map.initializeDetailMap();
            }

            // study list map
            if( $("#study_list_map").length > 0 ) {
                console.log("study list map initilaized");
                Map.init_study_list_map();
            }

            // study detail map
            if( $("#study_detail_map").length > 0 ) {
                console.log("study detail map initilaized");
                Map.init_study_detail_map();
            }

        });
        // handle map stuff for window resize
        $(window).resize(function() {
            // list map
            if($("#list_map").length > 0) {
                Map.initializeListMap();
            }
            // detail page map
            if($("#detail_map").length > 0) {
                Map.initializeDetailMap();
            }
        });
    },

    init_map_page: function () {
        //Geolocation.init_location_toggles();
    },

    initializeListMap: function () {
        var mapExists = document.getElementById("list_map");
        var pos = Geolocation.get_client_latlng();
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

            // show user location marker if user is sharing
            if (Geolocation.get_location_type() !== "default") {

                // current location marker
                var locationMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: '#c0392b',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        scale: 5,
                        strokeWeight: 2
                    },
                });

                // add radius overlay and bind to location marker
                var circle = new google.maps.Circle({
                    map: map,
                    radius: 30,    // meters
                    fillColor: '#c0392b',
                    fillOpacity: 0.15,
                    strokeWeight: 0
                });
                circle.bindTo('center', locationMarker, 'position');

                // pulsate the user location marker
                /**

                var direction = 1;
                var rmin = 20, rmax = 50;
                setInterval(function() {
                    var radius = circle.getRadius();
                    if ((radius > rmax) || (radius < rmin)) {
                        direction *= -1;
                    }
                    circle.setRadius(radius + direction * 10);
                }, 300);
                **/

                // add user location marker to map
                window.user_location_marker = locationMarker;

            }

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
                        scale: 6,
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
                        infoWindow.setContent("<div><strong>"+data.spot_name+"</strong><br>"+data.building+"<br><a href='/food/"+data.id+"'>View details</a></div>");
                        infoWindow.open(map, marker);

                        $('li').css('background', 'none'); // clear any highlighted spots first
                        $('#' + data.id).css('background', '#e8eaf7');

                        //$('.scout-scroll').scrollTo('#' + data.id);
                        List.scroll_to_spot('#' + data.id);

                    });

                    google.maps.event.addListener(infoWindow,'closeclick',function(){
                        $('#' + data.id).css('background', 'none');
                    });

                    // prevent google maps from being tab navigated
                    google.maps.event.addListener(map, "tilesloaded", function(){
                        $("#list_map a").attr("tabindex","-1");
                    });

                    // handle hover event for main list view
                    $('#' + data.id).hover(
                        function () {
                            //map.setCenter(marker.getPosition());
                            $('li').css('background', 'none');
                            $(this).css({"background":"#e8eaf7"});
                            infoWindow.setContent("<div><strong>"+data.spot_name+"</strong><br>"+data.building+"</div>");
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

            if (Geolocation.get_location_type() !== "default") {
                // Don't store user marker in bounds as it can change
                bounds.extend(locationMarker.position);
            }

            // fit all spots into the map boundary
            // map.fitBounds(bounds);

            // cluster the markers using marker clusterer
            //var markerCluster = new MarkerClusterer(map, markers);
            window.map = map;
        }
    },

    initializeDetailMap: function() {

        var mapExists = document.getElementById("detail_map");
        var isMobile = $("body").data("mobile");
        var myLatlng, mapOptions;

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

            var map = new google.maps.Map(document.getElementById('detail_map'), mapOptions);
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
                //labelContent: "<span class='marker-text' style='margin-left:18px;font-size:12px;'>" + spot_name + "</span>",
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

        }

    },

    init_study_list_map: function() {

        var mapExists = document.getElementById("study_list_map");

        if(mapExists) {

            L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhcmxvbnBhbGFjYXkiLCJhIjoiY2lpMHYwZ3I2MDUzbHQzbTFnaWRmZnV1NCJ9.WkswXwuPmbIDcYFdV096Aw';
            var map = L.mapbox.map('study_list_map', 'mapbox.streets')
                .setView([47.653811, -122.307815], 17);

            // As with any other AJAX request, this technique is subject to the Same Origin Policy:
            // http://en.wikipedia.org/wiki/Same_origin_policy
            // So the CSV file must be on the same domain as the Javascript, or the server
            // delivering it should support CORS.
            var featureLayer = L.mapbox.featureLayer()
                .loadURL('/static/scout/js/geojson/study.geojson')
                .on('ready', function(e) {

                    // fit the markers onto the map bounds
                    featureLayer.eachLayer(function(layer) {
                        map.fitBounds(featureLayer.getBounds());
                    });

                    // handle marker clustering
                    var clusterGroup = new L.MarkerClusterGroup();
                    e.target.eachLayer(function(layer) {
                       clusterGroup.addLayer(layer);
                    });
                    map.addLayer(clusterGroup);
                })

            // add user location marker to map
            L.mapbox.featureLayer({
                // this feature is in the GeoJSON format: see geojson.org
                // for the full specification
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    // coordinates here are in longitude, latitude order because
                    // x, y is the standard for GeoJSON and many formats
                    coordinates: [
                      -122.307815,
                      47.65381
                    ]
                },
                properties: {
                    title: 'Your location',
                    description: 'swimming in the fountain',
                    // one can customize markers by adding simplestyle properties
                    // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                    'marker-size': 'small',
                    'marker-color': '#c0392b',
                    'marker-symbol': 'circle-stroked'
                }
            }).addTo(map);

        }

    },

    init_study_detail_map: function() {

        var mapExists = document.getElementById("study_detail_map");

        if(mapExists) {

            // get spot location from data attributes
            var spot_lat = $(".scout-card").data("latitude");
            var spot_lng = $(".scout-card").data("longitude");
            var spot_name = $(".scout-card").data("spotname");
            var spot_building = $(".scout-card").data("building");

            L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhcmxvbnBhbGFjYXkiLCJhIjoiY2lpMHYwZ3I2MDUzbHQzbTFnaWRmZnV1NCJ9.WkswXwuPmbIDcYFdV096Aw';
            var map = L.mapbox.map('study_detail_map', 'mapbox.streets')
                .setView([spot_lat, spot_lng], 18);

            // add user location marker to map
            L.mapbox.featureLayer({
                // this feature is in the GeoJSON format: see geojson.org
                // for the full specification
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    // coordinates here are in longitude, latitude order because
                    // x, y is the standard for GeoJSON and many formats
                    coordinates: [
                      spot_lng,
                      spot_lat
                    ]
                },
                properties: {
                    title: spot_name,
                    description: spot_building,
                    // one can customize markers by adding simplestyle properties
                    // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                    'marker-size': 'medium',
                    'marker-color': '#6564a8',
                    'marker-symbol': 'circle-stroked'
                }
            }).addTo(map);

        }

    },




};
