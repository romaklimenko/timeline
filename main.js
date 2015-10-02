(function() {
  require.config({
    paths: {
      "timeline": "./timeline"
    }
  });

  require(["timeline"], (function(_this) {
    return function(Timeline) {
      return Timeline.render(document.getElementById('timeline'));
    };
  })(this));

}).call(this);
