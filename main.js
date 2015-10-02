(function() {
  require.config({
    paths: {
      "raphael": "./bower_components/raphael/raphael",
      "timeline": "./timeline"
    }
  });

  require(["timeline"], (function(_this) {
    return function(Timeline) {
      return Timeline.render(document.getElementById('timeline'));
    };
  })(this));

}).call(this);
