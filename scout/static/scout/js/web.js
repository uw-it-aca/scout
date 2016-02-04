$(document).on('ready page:load page:restore', function(event) {

	/// async load css by flipping the media attribute to all
    console.log("styles on")
	$('link[rel="stylesheet"]').attr('media', 'all');

    Filter.init_events();

    Navigation.set_page_tab();

    // handle gallery images
    $('#imageContainer img').each(function (index) {
        if ($(this).attr('onclick') != null) {
            if ($(this).attr('onclick').indexOf("runThis()") == -1) {
                $(this).click(function () {
                    $(this).attr('onclick');
                    var src = $(this).attr("src");
                    ShowLargeImage(src);
                    console.log("asdkfljlask;djflkasjdf");
                });
            }
        }
        else {
            $(this).click(function () {
                var src = $(this).attr("src");
                ShowLargeImage(src);
            });
        }
    });

    $('body').on('click', '.modal-overlay', function () {
        $('.modal-overlay, .modal-img').remove();
        $('body').removeClass("freeze");
    });

    function ShowLargeImage(imagePath) {
        $('body').addClass("freeze");

        $('body').append('<div class="modal-overlay"><div class="modal-img"><img src="' + imagePath.replace("small","large") + '" /></div></div>');
    }

    // details spot image aspect ratio 16:9
	if($(".scout-details-container .scout-spot-image").length > 0) {
        var aspectHeight = Math.round(( $(".scout-spot-image").width() /16)*9);
        $(".scout-spot-image").height(aspectHeight);
	}


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
            $("#link_discover").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }
        else if (pathname.indexOf("/filter") >= 0) {
            $("#link_filter").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }
        else if (pathname.indexOf("/detail") >= 0) {
            $("#link_discover").css("border-bottom", "solid 3px #fff");
            $("#link_all").css("border-bottom", "solid 3px #fff");
            $("#link_filter").css("border-bottom", "solid 3px #fff");
        }
        else {
            $("#link_all").css({"border-bottom":"solid 3px #6564A8", "color":"#6564A8"});
        }

    },
};
