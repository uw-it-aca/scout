var pathname;

function initialize() {
    
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
        
    // "details" page was loaded
    if (pathname.indexOf("/detail/") >= 0) {
        
        console.log('detail page loaded');
        
        // uw fountain
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 19, scrollwheel: false };
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

google.maps.event.addDomListener(window, 'load', initialize);