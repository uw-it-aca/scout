document.addEventListener('WebViewJavascriptBridgeReady', function(event) {

    // initialize bridge
    var bridge = event.bridge
    bridge.init()

    // Start using the bridge by registering events

    // register handler for receiving data from device
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {

		//alert(data + ":fire button clicked from native bridge");

		// handle the filter options on the page and go to the filtered url
		window.location.href=Filter.get_filter_url();

	})

	// send this to the device
	var blah = "send this to the device from javascript";

	// call a handler for sending data to device
	bridge.callHandler('testObjcCallback', blah, function(response) {
	 	log('JS got response', response)
	})


}, false)


// jquery ready

$( document ).ready(function() {

    // Include filter js if on filter page
	if(window.location.href.indexOf("/filter/") > -1){
		$.getScript('/static/scout/js/filter.js');
	}


	// handle resetting the filters
	$('#reset_filter').click(function() {

		// return to list view and default state
		alert("clear the form!");
	});

});
