(function() {
  define(["jquery", "moment", "raphael"], (function(_this) {
    return function($, Moment, Raphael) {
      var dateToPx, render, renderEndMarker, renderFutureLine, renderLine, renderPastLine, renderStartMarker, renderText, renderToday, updateY;
      _this.margin = {
        top: 15,
        right: 5,
        bottom: 5,
        left: 5
      };
      _this.lineHeight = 25;
      _this.minimumWidth = 940;
      dateToPx = function(date) {
        return new Moment(date).diff(_this.from, "days") * _this.pixelsPerDay + _this.margin.left;
      };
      updateY = function() {
        return _this.y = _this.lines.length * _this.lineHeight + _this.margin.top;
      };
      renderStartMarker = function(line) {
        var startMarker;
        startMarker = _this.paper.circle(dateToPx(line.from), _this.y, 3).attr({
          "fill": "#000000",
          "title": new Moment(line.from).year()
        });
        return startMarker;
      };
      renderEndMarker = function(line) {
        if (_this.to === line.to) {
          return;
        }
        return _this.paper.circle(dateToPx(line.to), _this.y, 3).attr({
          "fill": "#000000",
          "title": new Moment(line.to).year()
        });
      };
      renderPastLine = function(line) {
        pastLine;
        var pastLine, x0, x1;
        x0 = dateToPx(line.from);
        x1 = dateToPx(line.to);
        if (x0 <= _this.xNow) {
          pastLine = _this.paper.path("M" + x0 + " " + _this.y + "L" + Math.min(x1, _this.xNow) + " " + _this.y).attr({
            "stroke-width": 2
          });
        }
        return pastLine;
      };
      renderFutureLine = function(line) {
        futureLine;
        var futureLine, x0, x1;
        x0 = dateToPx(line.from);
        x1 = dateToPx(line.to);
        if (x1 >= _this.xNow) {
          futureLine = _this.paper.path("M" + Math.max(x0, _this.xNow) + " " + _this.y + "L" + x1 + " " + _this.y).attr({
            "stroke-dasharray": "-",
            "stroke-width": 2
          });
        }
        if (_this.to === line.to) {
          futureLine.attr({
            "arrow-end": "open"
          });
        }
        return futureLine;
      };
      renderText = function(line) {
        var text, textWidth, x;
        x = dateToPx(line.from) + 2;
        text = _this.paper.text(x, _this.y - 10, line.what).attr({
          "text-anchor": "start"
        });
        textWidth = text.getBBox().width;
        if (x < _this.xNow && ((x + textWidth + 5) > _this.xNow)) {
          text.attr("x", _this.xNow - textWidth - 5);
        }
        return text;
      };
      renderLine = function(line) {
        var result;
        if (!line.to) {
          line.to = _this.to;
        }
        if (!line.from) {
          line.from = _this.from;
        }
        result = {};
        result.pastLine = renderPastLine(line);
        result.futureLine = renderFutureLine(line);
        result.startMarker = renderStartMarker(line);
        result.endMarker = renderEndMarker(line);
        result.text = renderText(line);
        return result;
      };
      renderToday = function() {
        var y;
        y = _this.paper.height;
        _this.paper.path("M" + _this.xNow + " 0L" + _this.xNow + " " + y).attr({
          "stroke": "#FF0000",
          "stroke-width": 2
        });
        return _this.paper.text(_this.xNow + 5, y - _this.margin.bottom - 1, "Living my life, " + (new Moment().diff(_this.from, "days") * 100 / _this.days).toFixed(2) + "% done.").attr({
          "fill": "#FF0000",
          "text-anchor": "start"
        });
      };
      render = function(el, data) {
        var age, expantancy, headerText, line, _i, _len, _ref;
        _this.from = new Moment(data.from);
        _this.to = new Moment(data.to);
        if (_this.paper && _this.paper.remove) {
          _this.paper.remove();
        }
        _this.days = _this.to.diff(_this.from, "days");
        _this.width = Math.max(_this.minimumWidth, $(el).width()) - _this.margin.left - _this.margin.right;
        _this.height = data.lines.length * _this.lineHeight + _this.margin.top + _this.margin.bottom;
        _this.pixelsPerDay = _this.width / _this.days;
        _this.xNow = dateToPx(new Date());
        _this.lines = [];
        _this.paper = new Raphael(el, _this.width + _this.margin.right + _this.margin.left, _this.height + _this.margin.top + _this.margin.bottom);
        updateY();
        age = new Moment().diff(_this.from, "years");
        expantancy = new Moment(_this.to).diff(_this.from, "years");
        headerText = data.what.replace("{age}", age).replace("{expantancy}", expantancy);
        _this.lines.push(renderLine({
          "from": _this.from,
          "to": _this.to,
          "what": headerText
        }));
        updateY();
        _ref = data.lines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          _this.lines.push(renderLine(line));
          updateY();
        }
        return renderToday();
      };
      return {
        render: render
      };
    };
  })(this));

}).call(this);
