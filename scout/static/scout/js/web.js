$(document).on('ready page:load page:restore', function(event) {

	/// async load css by flipping the media attribute to all
    console.log("styles on")
	$('link[rel="stylesheet"]').attr('media', 'all');

    $("#filter_toggle").click(function(e) {
        e.preventDefault();
        $("#filter_container").toggle("slow", function() {
            // Animation complete.
        });
    });

});
