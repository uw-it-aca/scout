// ios initialization

$(document).on('turbolinks:load', function() {

    console.log("turbolinks ios fired!");

    // track visits in google analytics
    try{
        ga('send', 'pageview', (location.pathname + location.search));
        console.info("Navigated to: " + location.pathname + location.search);
    }
    catch(e){
        console.log("No ga function, GOOGLE_ANALYTICS_KEY may not be set.");
    };

    // initialize framework7
    var myApp = new Framework7({
  		router: false,
  		fastClicks: true,
  		activeState: true,
  	});

    switch(location.pathname) {
      case "/h/seattle/":
      case "/h/bothell/":
      case "/h/tacoma/":
        console.log("switch on discover");
        Geolocation.getLocation();
        break;
      case "/h/seattle/food/":
      case "/h/bothell/food/":
      case "/h/tacoma/food/":
        console.log("switch on food");
        Geolocation.getLocation();
        break;
      case "/h/seattle/study/":
      case "/h/bothell/study/":
      case "/h/tacoma/study/":
        console.log("switch on study");
        Geolocation.getLocation();
        break;
      case "/h/seattle/tech/":
      case "/h/bothell/tech/":
      case "/h/tacoma/tech/":
        console.log("switch on tech");
        Geolocation.getLocation();
        break;
    }

});
