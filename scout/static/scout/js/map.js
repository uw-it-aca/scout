var pathname;

function loadGoogleMaps() {
    
    var myLatlng, mapOptions;
    
    console.log('google map loaded');
    
    pathname = window.location.pathname;
    
    // uw fountain
    /*
    var myLatlng = new google.maps.LatLng(47.653811, -122.307815);
    
    var mapOptions = {
        center: myLatlng,
        zoom: 16
    };
    */
     
    // url routing 
        
    if (pathname.indexOf("/seattle/food/18374") >= 0) {
            
        // uw fountain
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 18, scrollwheel: false, draggable: false, disableDefaultUI: true };
    }
    else if (pathname.indexOf("/favorites/56874") >= 0) {
            
        // uw fountain
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 17, scrollwheel: false, draggable: false, disableDefaultUI: true };
    }
    else if (pathname.indexOf("/seattle/food/") >= 0) {
            
        // uw fountain
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 17, scrollwheel: false};
    }
    else {
         
        // seattle
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 16 };
    }
    

    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
        
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!'
    });
    
}

google.maps.event.addDomListener(window, 'load', loadGoogleMaps);