$(document).on('ready', function(event) {

    Layout.init_layout();
    Navigation.set_page_tab();

    // page based JS calls
    var page_path = window.location.pathname;
    if (page_path.indexOf("food") !== -1) {
        List.init();
        Map.init_map();
    } else if (page_path.indexOf("detail") !== -1) {
        Map.init_map();

    } else if (page_path.indexOf("filter") !== -1) {
        Filter.init();
    } else if (page_path.indexOf("map") !== -1){
        // Mobile map page
        Map.init_map_page();
        List.init();
        Map.init_map();
    } else {
        Discover.init_cards();
    }
    Filter.replace_food_href();

    // call this last so all page level location event listeners have been declared
    Geolocation.update_location();

    Filter.init_events();

    Gallery.init_gallery();
    
});

// scrollTo function

$.fn.scrollTo = function(target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
        callback = options;
        options = target;
    }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 140,
        duration: 400,
        //easing: 'swing'
    }, options);

    return this.each(function() {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({
            scrollTop: scrollY
        }, parseInt(settings.duration), settings.easing, function() {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });
    });
};
