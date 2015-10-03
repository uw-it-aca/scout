// Initialize your app


$(function() {
    console.log( "ready!" );
    
    
    var myApp = new Framework7({
		material: true,
	    materialRipple: true,
	    materialRippleElements: '.ripple-blue, .ripple-green',
	    fastClicks: true,
	    activeState: true,
	    activeStateElements: 'a, button, label, span',
	});
    
});
