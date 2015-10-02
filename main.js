(function() {
  require.config({
    paths: {
      "raphael": "./bower_components/raphael/raphael",
      "text": "./bower_components/requirejs-text/text",
      "timeline": "./timeline"
    }
  });

  require(["timeline", "text!./timeline.json"], (function(_this) {
    return function(Timeline, text) {
      return Timeline.render(document.getElementById('timeline'), JSON.parse(text));
    };
  })(this));

}).call(this);
