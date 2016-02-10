var Layout = {

    init_layout: function(){

        /// async load css by flipping the media attribute to all
    	$('link[rel="stylesheet"]').attr('media', 'all');

        // size the detail image height on detail.html
        if($(".scout-details-container .scout-spot-image").length > 0) {
            var aspectHeight = Math.round(( $(".scout-spot-image").width() /16)*9);
            $(".scout-spot-image").height(aspectHeight);
    	}

        // size the map on map.html (mobile only)
        if($(".scout-map #list_map").length > 0) {
            var offsetHeight = ($(".scout-header").outerHeight() + $(".scout-filter-results-container").outerHeight() + $(".scout-footer").outerHeight());
            $("#list_map").height($(window).outerHeight() - offsetHeight);
        }

        // show user their location from cookie
        if($("#user_location").length > 0) {
            var cookie_data = Cookies.get('user_position');
            var data = JSON.parse(cookie_data);
            $("#user_location").html("lat:"+ data.latitude + " lon:" + data.longitude);
        }

    },
};
