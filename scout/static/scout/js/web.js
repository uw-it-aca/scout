$(document).on('ready page:load page:restore', function(event) {

	/// async load css by flipping the media attribute to all
    console.log("styles on")
	$('link[rel="stylesheet"]').attr('media', 'all');

    Filter.init_events();

    Navigation.set_page_tab();

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
}


// handle navigation
var Navigation = {

    set_page_tab: function(){

        // get the current location
        var pathname = window.location.pathname;

        if (pathname.indexOf("/discover") >= 0) {
            $("#link_discover").css({"border-bottom":"solid 3px #fff", "color":"#fff"});
        }
        else if (pathname.indexOf("/filter") >= 0) {
            $("#link_filter").css({"border-bottom":"solid 3px #fff", "color":"#fff"});
        }
        else if (pathname.indexOf("/detail") >= 0) {
            $("#link_discover").css("border-bottom", "solid 3px #6564A8");
            $("#link_all").css("border-bottom", "solid 3px #6564A8");
            $("#link_filter").css("border-bottom", "solid 3px #6564A8");
        }
        else {
            $("#link_all").css({"border-bottom":"solid 3px #fff", "color":"#fff"});
        }

    },
};
