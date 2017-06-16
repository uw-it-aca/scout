$(function(){

    Layout.init_layout();
    Navigation.set_campus_selection();
    // Set location first so map knows default position when it initializes
    Geolocation.update_location();

    // page based JS calls
    var page_path = window.location.pathname;

    if (page_path.indexOf("food") !== -1) {
        // food
        Geolocation.display_location_status();
        List.init();
        Map.init_map();
        Filter.init();
    } else if (page_path.indexOf("study") !== -1){
        Geolocation.display_location_status();
        List.init();
        Map.init_map();
        Filter.init();

        // initialize slick image slider
        $('.scout-spot-gallery').slick({
            dots: true,
            arrows: false,
        });

    } else if (page_path.indexOf("tech") !== -1){
        Geolocation.display_location_status();
        List.init();
        Map.init_map();
        Filter.init();

    } else if (page_path.indexOf("performance") !== -1){

        // load json payload using ajax request
        $.ajax({
           url: "/seattle/api/study/",
           type: 'get',
           success: function(data) {
               //If the success function is execute,
               //then the Ajax request was successful.
              $("#loading_performance").html(JSON.stringify(data));
           },
           error: function (xhr, ajaxOptions, thrownError) {
               var error = 'Ajax request failed: ' + xhr.responseText;
               $("#loading_performance").html(error);
             }
        });


    } else {
        Discover.init_cards();
        Map.init_map();
    }
    Filter.replace_navigation_href();
    // call this last so all page level location event listeners have been declared
    Geolocation.update_location();
    Filter.init_events();




});

$(window).scroll(function(){

    var isMobile = $("body").data("mobile");

});
