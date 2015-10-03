var margin = {
  top: 15,
  right: 5,
  bottom: 5,
  left: 5
};

var data = {
  "startDate": "1981-03-12",
  "endDate": "2056-03-12",
  "what": "I hope to live about 75 years:",
  "lines": [
    { "startDate": "1988-09-01", "endDate": "1995-05-25",
      "what": "Studied at Lyceum №100" },
    { "startDate": "1995-09-01", "endDate": "1998-05-25",
      "what": "Studied at Public School №33" },
    { "startDate": "1998-09-01", "endDate": "2001-09-01",
      "what": "Laboratory in NIOKB NESSY" },
    { "startDate": "1999-09-01", "endDate": "2004-06-01",
      "what": "Studied at Dnipropetrovsk State Financial Academy. Financial Specialist." },
    { "startDate": "2002-02-25", "endDate": "2007-03-05",
      "what": "Economist in Privatbank" },
    { "startDate": "2004-08-06",
      "what": "Married" },
    { "startDate": "2005-05-11",
      "what": "Daughter" },
    { "startDate": "2007-03-05", "endDate": "2008-08-01",
      "what": "Software Developer in Nebesa" },
    { "startDate": "2008-08-01", "endDate": "2009-09-01",
      "what": "Software Developer in SaM Solutions GmbH" },
    { "startDate": "2009-10-01", "endDate": "2009-12-31",
      "what": "Software Developer in Exigen" },
    { "startDate": "2010-01-01", "endDate": "2014-04-18",
      "what": "Software Developer in Sitecore Ukraine" },
    { "startDate": "2014-05-01", "endDate": "2048-03-12",
      "what": "Software Developer in Sitecore Denmark" },
    { "startDate": "2048-03-12",
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
  var lineHeight = 25;
  var minimumWidth = 980;
  var y = margin.top - lineHeight;

  var dateDiff = function(startDate, endDate) {
    return Math.abs((startDate - endDate) / 864e5);
  };

  var dateToPx = function(date) {
    return dateDiff(date, beginningOfLife) * pixelsPerDay + margin.left;
  };

  // inner functions ->
  var renderLine = function(line) {
    var renderPastLine = function(line) {
      var x0 = dateToPx(new Date(line.startDate));
      var x1 = dateToPx(new Date(line.endDate));
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
      var x0 = dateToPx(new Date(line.startDate));
      var x1 = dateToPx(new Date(line.endDate));
      if (x1 >= xNow) {
        svgPath(svg, "M" + Math.max(x0, xNow) + " " + y + "L" + x1 + " " + y,
          {
            "stroke": "#000000",
            "stroke-dasharray": "6,2",
            "stroke-width": 2,
            "marker-start": x0 > xNow ? "url(#markerCircle)" : "",
            "marker-end": endOfLife === line.endDate ? "url(#markerArrow)" : "url(#markerCircle)"
          });
      }
    };

    var renderText = function(line) {
      var x = dateToPx(new Date(line.startDate)) + 2;
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
    
    if (!line.endDate) {
      line.endDate = endOfLife;
    }

    if (!line.startDate) {
      line.startDate = beginningOfLife;
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
  // <- inner functions

  var beginningOfLife = new Date(data.startDate);
  var endOfLife = new Date(data.endDate);

  var days = dateDiff(beginningOfLife, endOfLife);
  var width = Math.max(minimumWidth, 960) - margin.left - margin.right;
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