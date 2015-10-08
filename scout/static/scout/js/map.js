// handle map stuff on page load

$(document).on('ready page:load page:restore', function(event) {
	
	// list map
	
	if($("#list_map").length > 0) {
		
		console.log("loading map");
		initializeListMap();
	}

});