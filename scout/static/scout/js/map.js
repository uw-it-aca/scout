var pathname;
var myLatlng, mapOptions, map, marker;
 
function gmap() {
    
    //if (typeof google !== "undefined"){
    if (typeof google === 'object' && typeof google.maps === 'object') {
        
        // Map script is already loaded
        console.log('gmap already loaded');
        initialize();
        
    } else {
        loadGoogleAPI();         
    }     

}
        
function initialize() {
   
    pathname = window.location.pathname;
         
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
        
        console.log("seattle food list");
    }
    else {
         
        // seattle
        myLatlng = new google.maps.LatLng(47.653811, -122.307815);
        mapOptions = { center: myLatlng, zoom: 16 };
    }
    
    // load the map only if map-canvas exists
        
    if (document.getElementById("map-canvas")) {
            
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        
        marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Hello World!'
        });
    }
    
}

function loadGoogleAPI() {
        
    var script = document.createElement('script');
    script.type = 'text/javascript';
          
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
      
    document.body.appendChild(script);
    
}


