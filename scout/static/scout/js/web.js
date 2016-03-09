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
        Gallery.init_gallery();
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
    
});
