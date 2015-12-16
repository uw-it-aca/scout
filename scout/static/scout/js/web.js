$(document).on('ready page:load page:restore', function(event) {

	/// async load css by flipping the media attribute to all
    console.log("styles on")
	$('link[rel="stylesheet"]').attr('media', 'all');

    $("#filter_toggle").click(function(e) {
        e.preventDefault();
        $("#filter_container").toggle();
    });

});

// scrollTo function

$.fn.scrollTo = function(target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
        callback = options;
        options = target;
    }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 100,
        duration: 500,
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
