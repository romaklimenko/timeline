var data = {
  "from": "1981-03-12",
  "to": "2056-03-12",
  "what": "Born in 1981, I hope to live about 75 years:",
  "lines": [
    { "from": "1988-09-01", "to": "1995-05-25",
      "what": "Studied at Lyceum №100" },
    { "from": "1995-09-01", "to": "1998-05-25",
      "what": "Studied at Public School №33" },
    { "from": "1998-09-01", "to": "2001-09-01",
      "what": "Laboratory in NIOKB NESSY" },
    { "from": "1999-09-01", "to": "2004-06-01",
      "what": "Studied at Dnipropetrovsk State Financial Academy. Financial Specialist." },
    { "from": "2002-02-25", "to": "2007-03-05",
      "what": "Economist in Privatbank" },
    { "from": "2004-08-06",
      "what": "Married" },
    { "from": "2005-05-11",
      "what": "Daughter" },
    { "from": "2007-03-05", "to": "2008-08-01",
      "what": "Software Developer in Nebesa" },
    { "from": "2008-08-01", "to": "2009-09-01",
      "what": "Software Developer in SaM Solutions GmbH" },
    { "from": "2009-10-01", "to": "2009-12-31",
      "what": "Software Developer in Exigen" },
    { "from": "2010-01-01", "to": "2014-04-18",
      "what": "Software Developer in Sitecore Ukraine" },
    { "from": "2014-05-01", "to": "2048-03-12",
      "what": "Software Developer in Sitecore Denmark" },
    { "from": "2048-03-12",
      "what": "Time to relax" }
  ]
};

var SVG = function(element, width, height) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  setAttributes(svg, { "height": height, "width": width });

  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  var markerCircle = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  setAttributes(markerCircle,
  {
    "id": "markerCircle",
    "markerWidth": "8",
    "markerHeight": "8",
    "refX": "5",
    "refY": "5"
  });

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  setAttributes(circle,
  {
    "cx": "5",
    "cy": "5",
    "r": "1.5",
    "style": "stroke: none; fill:#000000;"
  });

  markerCircle.appendChild(circle);
  defs.appendChild(markerCircle);

  var markerArrow = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  setAttributes(markerArrow,
  {
    "id": "markerArrow",
    "markerWidth": "6",
    "markerHeight": "6",
    "refX": "5",
    "refY": "3.5"
  });

  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  setAttributes(path, { "d": "M0,1 6,3.5 0,6", "style": "fill:#000000;" });
  markerArrow.appendChild(path);
  defs.appendChild(markerArrow);

  svg.appendChild(defs);
  element.appendChild(svg);
  return svg;
};

var setAttributes = function(element, attributes) {
  for (var attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute])
  }
};

var svgPath = function(svg, pathString, attributes) {
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  attributes["d"] = pathString;
  setAttributes(path, attributes);
  svg.appendChild(path);
  return path;
};

var svgText = function(svg, x, y, textString, attributes) {
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  setAttributes(text, { "x": x, "y": y });
  setAttributes(text, attributes);
  text.innerHTML = textString;
  svg.appendChild(text);
  return text;
}

var render = function(el) {
  var margin = {
    top: 15,
    right: 5,
    bottom: 5,
    left: 5
  };

  var lineHeight = 25;
  var minimumWidth = 860;
  var y = margin.top - lineHeight;

  var dateDiff = function(from, to) {
    return Math.abs((from - to) / 864e5);
  };

  var dateToPx = function(date) {
    return dateDiff(date, beginningOfLife) * pixelsPerDay + margin.left;
  };

  var renderLine = function(line) {
    var renderPastLine = function(line) {
      var x0 = dateToPx(new Date(line.from));
      var x1 = dateToPx(new Date(line.to));
      if (x0 <= xNow) {
        svgPath(svg,
          "M" + x0 + " " + y + "L" + Math.min(x1, xNow) + " " + y,
          {
            "stroke-width": 2,
            "stroke": "#000000",
            "marker-start": "url(#markerCircle)",
            "marker-end": x1 < xNow ? "url(#markerCircle)" : ""
          });
      }
    };

    var renderFutureLine = function(line) {
      var x0 = dateToPx(new Date(line.from));
      var x1 = dateToPx(new Date(line.to));
      if (x1 >= xNow) {
        svgPath(svg, "M" + Math.max(x0, xNow) + " " + y + "L" + x1 + " " + y,
          {
            "stroke": "#000000",
            "stroke-dasharray": "6,2",
            "stroke-width": 2,
            "marker-start": x0 > xNow ? "url(#markerCircle)" : "",
            "marker-end": endOfLife === line.to ? "url(#markerArrow)" : "url(#markerCircle)"
          });
      }
    };

    var renderText = function(line) {
      var x = dateToPx(new Date(line.from)) + 2;
      var text = svgText(svg, x, y - 5, line.what,
        {
          "text-anchor": "start",
          "font-family": "inherit",
          "font-size": 12
        });

      var textWidth = text.getBBox().width;
      if (x < xNow && ((x + textWidth + 5) > xNow)) {
        setAttributes(text, { "x": (xNow - textWidth - 5).toString() });
      }
    };

    if (!line.to) {
      line.to = endOfLife;
    }

    if (!line.from) {
      line.from = beginningOfLife;
    }

    y += lineHeight;

    renderPastLine(line);
    renderFutureLine(line);
    renderText(line);
  };

  var renderToday = function() {
    var y = svg.attributes["height"].value;

    svgPath(
      svg,
      "M" + xNow + " 0L" + xNow + " " + y,
      {
        "stroke": "#FF0000",
        "stroke-width": 2
      });

    svgText(svg, xNow + 5, y - margin.bottom - 4, "Living my life, " + (dateDiff(beginningOfLife, new Date()) * 100 / days).toFixed(2) + "% done.",
    {
      "fill": "#FF0000",
      "text-anchor": "start",
      "font-family": "inherit",
      "font-size": 12
    });
  };

  var beginningOfLife = new Date(data.from);
  var endOfLife = new Date(data.to);

  var days = dateDiff(beginningOfLife, endOfLife);
  var width = minimumWidth - margin.left - margin.right;
  var height = data.lines.length * lineHeight + margin.top + margin.bottom;
  var pixelsPerDay = width / days;
  var xNow = dateToPx(new Date());
  var svg = SVG(el, width + margin.right + margin.left, height + margin.top + margin.bottom);
  renderLine({
    "from": beginningOfLife,
    "to": endOfLife,
    "what": data.what
  });

  for (var i = 0; i < data.lines.length; i++) {
    renderLine(data.lines[i]);
  }

  renderToday();
};

render(document.getElementById('timeline'));
