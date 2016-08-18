$(document).on('ready', function(event) {

    Layout.init_layout();

    Navigation.set_campus_selection();
    Navigation.set_page_tab();

    // page based JS calls
    var page_path = window.location.pathname;

    if (page_path.indexOf("/food") !== -1) {
        console.log("on food");
        // food
        Geolocation.display_location_status();
        List.init();
        Map.init_map();
        Filter.init();
    }
    else if (page_path.indexOf("/study") !== -1){
        console.log("on study");
        Geolocation.display_location_status();
        List.init();
        Map.init_map();
        Filter.init();

        // initialize slick image slider
        $('.scout-spot-gallery').slick({
            dots: true,
            arrows: false,
        });

        $('.sticky-header-wrap').stickyHeaders({
            stickyElement: 'div',
        });

    }
    else if (page_path.indexOf("/tech") !== -1){
        console.log("on tech");
    }
    else {

        console.log("on discover");
        Discover.init_cards();
    }

    Filter.replace_food_href();

    // call this last so all page level location event listeners have been declared
    Geolocation.update_location();

    Filter.init_events();

});

$(window).scroll(function(){

    var isMobile = $("body").data("mobile");

    if (isMobile) {
        var sticky = $('.sticky'),
            scroll = $(window).scrollTop();

        if (scroll >= 250) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    }

});
