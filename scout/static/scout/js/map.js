// handle map stuff on page load

$(document).on('ready page:load page:restore', function(event) {
		
	// list map
	
	if($("#list_map").length > 0) {
		
		console.log("loading list map");
		initializeListMap();
	}
	
	// detail page map
	if($("#detail_map").length > 0) {
		
		console.log("loading detail map");
		initializeDetailMap();
	}
	
});


// handle map stuff for window resize

$(window).resize(function() {
	
	// list map
	
	if($("#list_map").length > 0) {
		
		console.log("loading list map");
		initializeListMap();
	}
	
	// detail page map
	if($("#detail_map").length > 0) {
		
		console.log("loading detail map");
		initializeDetailMap();
	}
	
});