var Layout = {

    init_layout: function(){

        /// async load css by flipping the media attribute to all
    	$('link[rel="stylesheet"]').attr('media', 'all');

        // size the detail image height on detail.html
        if($(".scout-details-container .scout-spot-image").length > 0) {
            var aspectHeight = Math.round(( $(".scout-spot-image").width() /100)*67); //(i.e. 16:9 or 100:67)
            $(".scout-spot-image").height(aspectHeight);
    	}

        // size the map on map.html (mobile only)
        if($(".scout-map #list_map").length > 0) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-filter-results-container").outerHeight() + $(".scout-footer").outerHeight());
            $("#list_map").height($(window).outerHeight() - offsetHeight);
        }

        // size the place list container
        if($(".scout-list-container").length > 0) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-geolocation").outerHeight() + $(".scout-filter-results").outerHeight() + $(".scout-footer").outerHeight());
            $(".scout-list-container").css({minHeight: $(window).outerHeight() - offsetHeight });
        }

        // size the dicover card container
        if($(".scout-discover-container").length > 0) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-geolocation").outerHeight() + $(".scout-footer").outerHeight());
            $(".scout-discover-container").css({minHeight: $(window).outerHeight() - offsetHeight });
        }

    },
};
