# Timeline


    define ["jquery", "moment", "raphael"], ($, Moment, Raphael) =>

      @margin = {
        top: 15
        right: 5
        bottom: 5
        left: 5
      }

      @lineHeight = 25
      @minimumWidth = 940

      dateToPx = (date) =>
        return new Moment(date).diff(@from, "days") * @pixelsPerDay + @margin.left

      updateY = =>
        @y = @lines.length * @lineHeight + @margin.top

      render = (el, data) =>
        @from = new Moment(data.from)
        @to = new Moment(data.to)

        @paper.remove() if @paper && @paper.remove

        @days = @to.diff(@from, "days")
        @width = Math.max(@minimumWidth, $(el).width()) - @margin.left - @margin.right
        @height = data.lines.length * @lineHeight + @margin.top + @margin.bottom
        @pixelsPerDay = @width / @days

        @xNow = dateToPx(new Date())

        @lines = []

        @paper = new Raphael(
          el
          @width + @margin.right + @margin.left
          @height + @margin.top + @margin.bottom)

        updateY()

        age = new Moment().diff(@from, "years")
        expantancy = new Moment(@to).diff(@from, "years")

        headerText = data.what.replace("{age}", age).replace("{expantancy}", expantancy)

        @lines.push(
          renderLine(
            "from": @from
            "to": @to
            "what": headerText))

        updateY()

        for line in data.lines
          @lines.push(renderLine(line))
          updateY()

        renderToday()

      renderLine = (line) =>
        line.to = @to if not line.to
        line.from = @from if not line.from

        result = {}

        result.pastLine = renderPastLine(line)
        result.futureLine = renderFutureLine(line)
        result.startMarker = renderStartMarker(line)
        result.endMarker = renderEndMarker(line)
        result.text = renderText(line)

        return result;

      renderPastLine = (line) =>
        pastLine

        x0 = dateToPx(line.from)
        x1 = dateToPx(line.to)

        if (x0 <= @xNow)
          pastLine = @paper
            .path("M" + x0 + " " + @y + "L" + Math.min(x1, @xNow) + " " + @y)
            .attr({ "stroke-width": 2 })

        return pastLine

      renderFutureLine = (line) =>
        futureLine

        x0 = dateToPx(line.from)
        x1 = dateToPx(line.to)

        if (x1 >= @xNow)
          futureLine = @paper
            .path("M" + Math.max(x0, @xNow) + " " + @y + "L" + x1 + " " + @y)
            .attr({ "stroke-dasharray": "-", "stroke-width": 2 })

        futureLine.attr({ "arrow-end": "open" }) if (@to is line.to)

        return futureLine

      renderToday = =>
        y = @paper.height

        @paper
          .path("M" + @xNow + " 0L" + @xNow + " " + y)
          .attr({ "stroke": "#FF0000", "stroke-width": 2 })

        @paper
          .text(
            @xNow + 5,
            y - @margin.bottom - 1,
            "Living my life, " + (new Moment().diff(@from, "days") * 100 / @days).toFixed(2) + "% done.")
          .attr({ "fill": "#FF0000", "text-anchor": "start" })

      renderStartMarker = (line) =>
        startMarker = @paper
          .circle(dateToPx(line.from), @y, 3)
          .attr({ "fill": "#000000", "title": new Moment(line.from).year() })

        return startMarker

      renderEndMarker = (line) =>
        return if @to is line.to

        return @paper
          .circle(dateToPx(line.to), @y, 3)
          .attr({ "fill": "#000000", "title": new Moment(line.to).year() })

      renderText = (line) =>
        x = dateToPx(line.from) + 2

        text = @paper
          .text(x, @y - 10, line.what)
          .attr({ "text-anchor": "start" })

        textWidth = text.getBBox().width

        if x < @xNow and ((x + textWidth + 5) > @xNow)
          text.attr("x", @xNow - textWidth - 5)

        return text

      return {
        render: render
      }