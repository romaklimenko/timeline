/* global define */
define(["jquery", "moment", "raphael"], (function($, Moment, Raphael) {
  
    // todo:
    // Moment.diff
    // Moment.year
    // paper.circle
    // paper.path
    // paper.text
    // paper.remove
    // 
  
    var margin = {
      top: 15,
      right: 5,
      bottom: 5,
      left: 5
    };
    
    var paper;
    var to;
    var from;
    var width, height, pixelsPerDay;
    var y;
    
    var xNow, days;
    
    var lines = [];

    var lineHeight = 25;
    var minimumWidth = 940;

    var dateToPx = function(date) {
      return new Moment(date).diff(from, "days") * pixelsPerDay + margin.left;
    };

    var updateY = function() {
      return y = lines.length * lineHeight + margin.top;
    };

    var renderStartMarker = function(line) {
      var startMarker;
      startMarker = paper.circle(dateToPx(line.from), y, 3).attr({
        "fill": "#000000",
        "title": new Moment(line.from).year()
      });
      return startMarker;
    };

    var renderEndMarker = function(line) {
      if (to === line.to) {
        return;
      }
      return paper.circle(dateToPx(line.to), y, 3).attr({
        "fill": "#000000",
        "title": new Moment(line.to).year()
      });
    };

    var renderPastLine = function(line) {
      pastLine;
      var pastLine, x0, x1;
      x0 = dateToPx(line.from);
      x1 = dateToPx(line.to);
      if (x0 <= xNow) {
        pastLine = paper.path("M" + x0 + " " + y + "L" + Math.min(x1, xNow) + " " + y).attr({
          "stroke-width": 2
        });
      }
      return pastLine;
    };

    var renderFutureLine = function(line) {
      var x0 = dateToPx(line.from);
      var x1 = dateToPx(line.to);
      if (x1 >= xNow) {
        var futureLine = paper.path("M" + Math.max(x0, xNow) + " " + y + "L" + x1 + " " + y).attr({
          "stroke-dasharray": "-",
          "stroke-width": 2
        });

        if (to === line.to) {
          futureLine.attr({
            "arrow-end": "open"
          });
        }
      }

      return futureLine;
    };

    var renderText = function(line) {
      var x = dateToPx(line.from) + 2;
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
      var result;
      if (!line.to) {
        line.to = to;
      }
      if (!line.from) {
        line.from = from;
      }
      result = {};
      result.pastLine = renderPastLine(line);
      result.futureLine = renderFutureLine(line);
      result.startMarker = renderStartMarker(line);
      result.endMarker = renderEndMarker(line);
      result.text = renderText(line);
      return result;
    };

    var renderToday = function() {
      y = paper.height;

      paper.path("M" + xNow + " 0L" + xNow + " " + y).attr({
        "stroke": "#FF0000",
        "stroke-width": 2
      });

      paper.text(xNow + 5, y - margin.bottom - 4, "Living my life, " + (new Moment().diff(from, "days") * 100 / days).toFixed(2) + "% done.").attr({
        "fill": "#FF0000",
        "text-anchor": "start",
        "font-family": "inherit",
        "font-size": 12
      });
    };

    var render = function(el, data) {
      var age, expantancy, headerText, line, _i, _len, _ref;
      from = new Moment(data.from);
      to = new Moment(data.to);
      if (paper && paper.remove) {
        paper.remove();
      }
      days = to.diff(from, "days");
      width = Math.max(minimumWidth, $(el).width()) - margin.left - margin.right;
      height = data.lines.length * lineHeight + margin.top + margin.bottom;
      pixelsPerDay = width / days;
      xNow = dateToPx(new Date());
      lines = [];
      paper = new Raphael(el, width + margin.right + margin.left, height + margin.top + margin.bottom);
      updateY();
      age = new Moment().diff(from, "years");
      expantancy = new Moment(to).diff(from, "years");
      headerText = data.what.replace("{age}", age).replace("{expantancy}", expantancy);
      lines.push(renderLine({
        "from": from,
        "to": to,
        "what": headerText
      }));

      updateY();
      _ref = data.lines;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        lines.push(renderLine(line));
        updateY();
      }
      renderToday();
    };

    return {
      render: render
    };
  }));