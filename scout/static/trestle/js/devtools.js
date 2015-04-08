
var windowH;

$(document).ready(function() {
    displayFoldIndicator();
});

$( window ).resize(function() {
    displayFoldIndicator();
});

function displayFoldIndicator() {
    windowH = $(window).height();
    $('#dev_viewport').css('top', windowH -2);
}