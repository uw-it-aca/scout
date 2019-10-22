// android initialization

document.addEventListener("turbolinks:load", function() {
  // track visits in google analytics
  try {
    ga("send", "pageview", location.pathname + location.search);
    //console.info("Navigated to: " + location.pathname + location.search);
  } catch (e) {
    //console.log("No ga function, GOOGLE_ANALYTICS_KEY may not be set.");
  }

  // initialize framework7
  var myApp = new Framework7({
    router: false,
    material: true,
    fastClicks: true,
    materialRipple: false,
    activeState: true
  });

  // initialize webview on main pages only
  var detailRe = new RegExp("/h/[a-z]+/[a-z]+/[0-9]+/");
  var foodRe = new RegExp("/h/[a-z]+/food/");
  var studyRe = new RegExp("/h/[a-z]+/study/");
  var techRe = new RegExp("/h/[a-z]+/tech/");
  var discoverRe = new RegExp("/h/[a-z]+/");

  switch (true) {
    case detailRe.test(location.pathname):
      break;
    case foodRe.test(location.pathname):
      WebView.initialize();
      break;
    case studyRe.test(location.pathname):
      WebView.initialize();
      break;
    case techRe.test(location.pathname):
      WebView.initialize();
      break;
    case discoverRe.test(location.pathname):
      WebView.initialize();
      break;
  }
});
