/* global define */
define(["raphael"], (function(Raphael) {
    var margin = {
      top: 15,
      right: 5,
      bottom: 5,
      left: 5
    };

    var life = {};

    var paper;
    var width, height, pixelsPerDay;

    var xNow, days, y;

    var lines;

    var lineHeight = 25;
    var minimumWidth = 940;

    var dateDiff = function(startDate, endDate) {
      return Math.abs((startDate - endDate) / 864e5);
    };
    
    var yearDiff = function(startDate, endDate) {
      var diff = endDate.getTime() - startDate.getTime();
      return Math.abs(new Date(diff).getUTCFullYear() - 1970);
    };
    
    var getAge = function(birthday) {
      return yearDiff(birthday, new Date())
    };

    var dateToPx = function(date) {
      return dateDiff(date, life.startDate) * pixelsPerDay + margin.left;
    };

    var updateY = function() {
      y = lines.length * lineHeight + margin.top;
    };

    var renderStartMarker = function(line) {
      return paper.circle(dateToPx(new Date(line.startDate)), y, 3).attr({
        "fill": "#000000",
        "title": new Date(line.startDate).getFullYear()
      });
    };

    var renderEndMarker = function(line) {
      if (life.endDate === line.endDate) {
        return;
      }
      return paper.circle(dateToPx(new Date(line.endDate)), y, 3).attr({
        "fill": "#000000",
        "title": new Date(line.endDate).getFullYear()
      });
    };

    var renderPastLine = function(line) {
      var x0 = dateToPx(new Date(line.startDate));
      var x1 = dateToPx(new Date(line.endDate));
      if (x0 <= xNow) {
        return paper.path("M" + x0 + " " + y + "L" + Math.min(x1, xNow) + " " + y).attr({
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

        if (life.endDate === line.endDate) {
          futureLine.attr({
            "arrow-end": "open"
          });
        }
      }

      return futureLine;
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
      return text;
    };

    var renderLine = function(line) {
      if (!line.endDate) {
        line.endDate = life.endDate;
      }
      if (!line.startDate) {
        line.startDate = life.startDate;
      }
      return {
        pastLine: renderPastLine(line),
        futureLine: renderFutureLine(line),
        startMarker: renderStartMarker(line),
        endMarker: renderEndMarker(line),
        text: renderText(line)
      };
    };

    var renderToday = function() {
      var y = paper.height;

      paper.path("M" + xNow + " 0L" + xNow + " " + y).attr({
        "stroke": "#FF0000",
        "stroke-width": 2
      });

      paper.text(xNow + 5, y - margin.bottom - 4, "Living my life, " + (dateDiff(life.startDate, new Date()) * 100 / days).toFixed(2) + "% done.").attr({
        "fill": "#FF0000",
        "text-anchor": "start",
        "font-family": "inherit",
        "font-size": 12
      });
    };

    var render = function(el, data) {
      life.startDate = new Date(data.startDate);
      life.endDate = new Date(data.endDate);
      if (paper && paper.remove) {
        paper.remove();
      }
      days = dateDiff(life.startDate, life.endDate);
      width = Math.max(minimumWidth, 960) - margin.left - margin.right;
      height = data.lines.length * lineHeight + margin.top + margin.bottom;
      pixelsPerDay = width / days;
      xNow = dateToPx(new Date());
      lines = [];
      paper = new Raphael(el, width + margin.right + margin.left, height + margin.top + margin.bottom);
      updateY();
      var expectancy = yearDiff(life.startDate, life.endDate);
      var headerText = data.what.replace("{age}", getAge(life.startDate)).replace("{expectancy}", expectancy);
      lines.push(renderLine({
        "from": life.startDate,
        "to": life.endDate,
        "what": headerText
      }));

      updateY();

      for (var i = 0; i < data.lines.length; i++) {
        var line = data.lines[i];
        lines.push(renderLine(line));
        updateY();
      }

      renderToday();
    };

    return {
      render: render
    };
  }));