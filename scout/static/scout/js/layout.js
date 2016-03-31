var Layout = {

    init_layout: function(){

        /// async load css by flipping the media attribute to all
    	$('link[rel="stylesheet"]').attr('media', 'all');

        var page_path = window.location.pathname;

        if (page_path.indexOf("food") !== -1) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-geolocation").outerHeight() + $(".scout-filter-results").outerHeight() + $(".scout-footer").outerHeight());
            $(".scout-list-container").css({minHeight: $(window).outerHeight() - offsetHeight });
        }
        else if (page_path.indexOf("detail") !== -1) {
            var aspectHeight = Math.round(( $(".scout-spot-image").width() /100)*67); //(i.e. 16:9 or 100:67)
            $(".scout-spot-image").height(aspectHeight);
        }
        else if (page_path.indexOf("map") !== -1) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-filter-results-container").outerHeight() + $(".scout-footer").outerHeight());
            $("#list_map").height($(window).outerHeight() - offsetHeight);
        }
        else {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-geolocation").outerHeight() + $(".scout-footer").outerHeight());
            $(".scout-discover-container").css({minHeight: $(window).outerHeight() - offsetHeight });

            // 404 page
            if($("#page_404").length > 0) {
                var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-footer").outerHeight());
                $("#page_404").css({minHeight: $(window).outerHeight() - offsetHeight });
            }

        }

    },
};
