/* global define */
define(["raphael"], (function(Raphael) {
    var margin = {
      top: 15,
      right: 5,
      bottom: 5,
      left: 5
    };

    var render = function(el, data) {
      var lineHeight = 25;
      var minimumWidth = 940;

      var y = margin.top - lineHeight;

      var dateDiff = function(startDate, endDate) {
        return Math.abs((startDate - endDate) / 864e5);
      };

      var yearDiff = function(startDate, endDate) {
        return Math.abs(new Date(endDate.getTime() - startDate.getTime()).getUTCFullYear() - 1970);
      };

      var getAge = function(birthday) {
        return yearDiff(birthday, new Date())
      };

      var dateToPx = function(date) {
        return dateDiff(date, beginningOfLife) * pixelsPerDay + margin.left;
      };

      // inner functions ->
      var renderLine = function(line) {
        var renderStartMarker = function(line) {
          paper.circle(dateToPx(new Date(line.startDate)), y, 3).attr({
            "fill": "#000000",
            "title": new Date(line.startDate).getFullYear()
          });
        };
    
        var renderEndMarker = function(line) {
          if (endOfLife === line.endDate) {
            return;
          }

          paper.circle(dateToPx(new Date(line.endDate)), y, 3).attr({
            "fill": "#000000",
            "title": new Date(line.endDate).getFullYear()
          });
        };
    
        var renderPastLine = function(line) {
          var x0 = dateToPx(new Date(line.startDate));
          var x1 = dateToPx(new Date(line.endDate));
          if (x0 <= xNow) {
            paper.path("M" + x0 + " " + y + "L" + Math.min(x1, xNow) + " " + y).attr({
              "stroke-width": 2
            });
          }
        };
    
        var renderFutureLine = function(line) {
          var x0 = dateToPx(new Date(line.startDate));
          var x1 = dateToPx(new Date(line.endDate));
          if (x1 >= xNow) {
            var futureLine = paper.path("M" + Math.max(x0, xNow) + " " + y + "L" + x1 + " " + y).attr({
              "stroke-dasharray": "-",
              "stroke-width": 2
            });
    
            if (endOfLife === line.endDate) {
              futureLine.attr({
                "arrow-end": "open"
              });
            }
          }
        };
    
        var renderText = function(line) {
          var x = dateToPx(new Date(line.startDate)) + 2;
          var text = paper.text(x, y - 10, line.what).attr({
            "text-anchor": "start",
            "font-family": "inherit",
            "font-size": 12
          });
    
          var textWidth = text.getBBox().width;
          if (x < xNow && ((x + textWidth + 5) > xNow)) {
            text.attr({
              "x": xNow - textWidth - 5
            });
          }
        };
        
        if (!line.endDate) {
          line.endDate = endOfLife;
        }

        if (!line.startDate) {
          line.startDate = beginningOfLife;
        }

        y += lineHeight;

        renderPastLine(line);
        renderFutureLine(line);
        renderStartMarker(line);
        renderEndMarker(line);
        renderText(line);
      };
  
      var renderToday = function() {
        var y = paper.height;
  
        paper.path("M" + xNow + " 0L" + xNow + " " + y).attr({
          "stroke": "#FF0000",
          "stroke-width": 2
        });
  
        paper.text(xNow + 5, y - margin.bottom - 4, "Living my life, " + (dateDiff(beginningOfLife, new Date()) * 100 / days).toFixed(2) + "% done.").attr({
          "fill": "#FF0000",
          "text-anchor": "start",
          "font-family": "inherit",
          "font-size": 12
        });
      };
      // <- inner functions

      var beginningOfLife = new Date(data.startDate);
      var endOfLife = new Date(data.endDate);

      if (paper && paper.remove) {
        paper.remove();
      }

      var days = dateDiff(beginningOfLife, endOfLife);
      var width = Math.max(minimumWidth, 960) - margin.left - margin.right;
      var height = data.lines.length * lineHeight + margin.top + margin.bottom;
      var pixelsPerDay = width / days;
      var xNow = dateToPx(new Date());
      var paper = new Raphael(el, width + margin.right + margin.left, height + margin.top + margin.bottom);
      var expectancy = yearDiff(beginningOfLife, endOfLife);
      var headerText = data.what.replace("{age}", getAge(beginningOfLife)).replace("{expectancy}", expectancy);
      renderLine({
        "from": beginningOfLife,
        "to": endOfLife,
        "what": headerText
      });

      for (var i = 0; i < data.lines.length; i++) {
        renderLine(data.lines[i]);
      }

      renderToday();
    };

    return {
      render: render
    };
  }));