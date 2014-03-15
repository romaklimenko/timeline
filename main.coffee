require.config
  paths:
    # libs
    "bootstrap-js": "./bower_components/bootstrap/dist/js/bootstrap"
    "jquery": "./bower_components/jquery/dist/jquery"
    "moment": "./bower_components/momentjs/moment"
    "raphael": "./bower_components/raphael/raphael"
    "text": "./bower_components/requirejs-text/text"

    # component
    "timeline": "timeline",

  shim:
    "bootstrap-js":
      deps: ["jquery"]

require ["jquery", "timeline", "text!../timeline.json"], ($, Timeline, text) =>
  Timeline.render($("#timeline")[0], JSON.parse(text))