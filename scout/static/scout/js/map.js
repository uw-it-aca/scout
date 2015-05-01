var pathname;
            
function initialize() {
   
    
   
    pathname = window.location.pathname;
    
    var myLatlng, mapOptions;
    
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
    
    
    
    // load the map only if map-canvas exists
        
    if (document.getElementById("map-canvas")) {
        
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Hello World!',
            animation: google.maps.Animation.DROP,
        });
        
    }
    
}

/****
function loadScript() {
     
     /*   
    var script = document.createElement('script');
    script.type = 'text/javascript';
          
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=initialize';
    
    document.body.appendChild(script);

    
    
    if (typeof google == "undefined") {
      jQuery.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=initialize")
      // no success callback necessary, google can load our stuff-todo-function
    } else {
       // if gmaps already loaded, we can just continue whatever else we want to do
       initialize()
    }

}

***/