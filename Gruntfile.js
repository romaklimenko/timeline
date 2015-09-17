/* jshint node: true */
module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          "main.js": "main.coffee",
          "timeline.js": "timeline.coffee"
        }
      }
    },
    watch: {
      files: ["**/*coffee*"],
      tasks: ["default"],
    },
  });

  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["coffee"]);
};