/*
    Orginal work under
    Open source under BSD 2-clause
    Copyright (c) 2015, Curtis Bratton
    All rights reserved.
*/
/*
    Updated to D3v4
    Code refactored
*/

function liquidFill(_config, _elementId, _value) {
  let value = _value;
  let config = loadConfig(_config);

  let elementId = _elementId;
  let element = d3.select(elementId);

  let radius = Math.min(parseInt(element.style('width')), parseInt(element.style('height'))) / 2;
  let locationX = parseInt(element.style('width')) / 2 - radius;
  let locationY = parseInt(element.style('height')) / 2 - radius;

  let textPixels = (config.textSize * radius / 2);
  let textFinalValue = parseFloat(value).toFixed(2);
  let textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
  let percentText = config.displayPercent ? '%' : '';
  let textRounder = setTextRounder(textFinalValue);

  let circleThickness = config.circleThickness * radius;
  let circleFillGap = config.circleFillGap * radius;
  let fillCircleMargin = circleThickness + circleFillGap;
  let fillCircleRadius = radius - fillCircleMargin;

  let waveHeightScale = getWaveHeightScale(config.waveHeight, config.waveHeightScaling);
  let waveHeight = fillCircleRadius * waveHeightScale(getFillLevel(value) * 100);
  let waveLength = fillCircleRadius * 2 / config.waveCount;
  let waveClipCount = 1 + config.waveCount;
  let waveClipWidth = waveLength * waveClipCount;
  let clipData = getClipWaveAreaData(waveClipCount);

  // Scales for drawing the outer circle.
  let circleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
  let circleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

  // Scales for controlling the size of the clipping path.
  let waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  let waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

  // Scales for controlling the position of the clipping path.
  let waveRiseScale = d3.scaleLinear()
    // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
    // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
    // circle at 100%.
    .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight),(fillCircleMargin - waveHeight)])
    .domain([0, 1]);

  let waveAnimateScale = d3.scaleLinear()
    .range([0, waveClipWidth - fillCircleRadius * 2])
    // Push the clip area one full wave then snap back.
    .domain([0, 1]);

  // Scale for controlling the position of the text within the element.
  let textRiseScaleY = d3.scaleLinear()
    .range([fillCircleMargin + fillCircleRadius * 2,(fillCircleMargin + textPixels * 0.7)])
    .domain([0, 1]);

  // Center the gauge within the parent SVG.
  let elementContainer = element.append('g').attr('transform', 'translate(' + locationX + ',' + locationY + ')');

  // Draw the outer circle.
  let circleArc = d3.arc().startAngle(circleX(0)).endAngle(circleX(1)).outerRadius(circleY(radius)).innerRadius(circleY(radius - circleThickness));
  elementContainer.append('path').attr('d', circleArc).style('fill', config.circleColor).attr('transform', 'translate(' + radius + ',' + radius + ')');

  // Display text and wave text overlay
  let textElement = {};

  // Text where the wave does not overlap.
  textElement.text1 = setText(
    config.textColor,
    elementContainer,
    textPixels,
    percentText,
    radius,
    textStartValue,
    config.textVertPosition);

  // The clipping wave area.
  let clipArea = d3.area()
    .x(d => waveScaleX(d.x))
    .y0(d => waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)))
    .y1(d => (fillCircleRadius * 2 + waveHeight));

  let waveGroup = elementContainer.append('defs').append('clipPath').attr('id', 'clipWave' + elementId);
  let wave = waveGroup.append('path').datum(clipData).attr('d', clipArea).attr('T', 0);

  // The inner circle with the clipping wave attached.
  let fillCircleGroup = elementContainer.append('g').attr('clip-path', 'url(#clipWave' + elementId + ')');
  fillCircleGroup.append('circle').attr('cx', radius).attr('cy', radius).attr('r', fillCircleRadius).style('fill', config.waveColor);

  // Text where the wave does overlap.
  textElement.text2 = setText(
    config.waveTextColor,
    fillCircleGroup,
    textPixels,
    percentText,
    radius,
    textStartValue,
    config.textVertPosition);

  // Make the value count up.
  if (config.valueCountUp) {
    for (let element of Object.values(textElement)) {
      textTweenTransition(element, textTween, textFinalValue, config.waveRiseTime);
    }
  }

  function textTween(value) {
    return function() {
      let format = d3.format(",d");
      let that = d3.select(this);
      let i = d3.interpolate(that.text(), value);
      return function(t) {
        that.text(format(i(t)) + percentText);
      };
    }
  };

  function textTweenTransition(element, textTween, textValue, waveRiseTime) {
    element.transition().duration(waveRiseTime).tween('text', textTween(textValue));
  }

  // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
  let waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
  if (config.waveRise) {
    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')').transition().duration(config.waveRiseTime).attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(getFillLevel(value)) + ')').on('start', function() {
      wave.attr('transform', 'translate(1,0)');
    }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
  } else {
    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(getFillLevel(value)) + ')');
  }

  if (config.waveAnimate)
    animateWave();

  function animateWave() {
    wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
    wave.transition().duration(config.waveAnimateTime * (1 - wave.attr('T'))).ease(d3.easeLinear).attr('transform', 'translate(' + waveAnimateScale(1) + ',0)').attr('T', 1).on('end', function() {
      wave.attr('T', 0);
      animateWave(config.waveAnimateTime);
    });
  }

  function getFillLevel(value) {
    return Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
  }

  function setText(color, element, fontSize, percent, radius, startValue, verticalPosition) {
    return element
      .append('text')
      .text(textRounder(startValue) + percent)
      .attr('class', 'liquidFillGaugeText')
      .attr('text-anchor', 'middle')
      .attr('font-size', fontSize + 'px')
      .style('fill', color)
      .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(verticalPosition) + ')');
  }
  function updater() {
    this.update = function(value) {
      let newFinalValue = parseFloat(value).toFixed(2);
      let textRounder = setTextRounder(newFinalValue);

      for (let element of Object.values(textElement)) {
        textTweenTransition(element, textTween, newFinalValue, config.waveRiseTime);
      }

      let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
      let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
      let waveRiseScale = d3.scaleLinear()
      // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
      // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
      // circle at 100%.
        .range([
        (fillCircleMargin + fillCircleRadius * 2 + waveHeight),
        (fillCircleMargin - waveHeight)
      ]).domain([0, 1]);
      let newHeight = waveRiseScale(fillPercent);
      let waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
      let waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);
      let newClipArea;
      if (config.waveHeightScaling) {
        newClipArea = d3.area().x(function(d) {
          return waveScaleX(d.x);
        }).y0(function(d) {
          return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
        }).y1(function(d) {
          return (fillCircleRadius * 2 + waveHeight);
        });
      } else {
        newClipArea = clipArea;
      }

      let newWavePosition = config.waveAnimate
        ? waveAnimateScale(1)
        : 0;
      wave.transition().duration(0).transition().duration(config.waveAnimate
        ? (config.waveAnimateTime * (1 - wave.attr('T')))
        : (config.waveRiseTime)).ease(d3.easeLinear).attr('d', newClipArea).attr('transform', 'translate(' + newWavePosition + ',0)').attr('T', '1').on('end', function() {
        if (config.waveAnimate) {
          wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
          animateWave(config.waveAnimateTime);
        }
      });
      waveGroup.transition().duration(config.waveRiseTime).attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')')
    }
  }
  return new updater();
}

// Takes  default config and merges it with given properties
function loadConfig(_config) {
  return Object.assign({
    circleColor: '#78B', // The color of the outer circle.
    circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
    circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
    displayPercent: true, // If true, a % symbol is displayed after the value.
    maxValue: 100, // The gauge maximum value.
    minValue: 0, // The gauge minimum value.
    textColor: '#456', // The color of the value text when the wave does not overlap it.
    textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
    textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
    valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
    waveAnimate: true, // Controls if the wave scrolls or is static.
    waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
    waveColor: '#78B', // The color of the fill wave.
    waveCount: 1, // The number of full waves per width of the wave circle.
    waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
    waveHeightScaling: false, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
    waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
    waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
    waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
    waveTextColor: '#4DB' // The color of the value text when the wave overlaps it.
  }, _config);
}

function getWaveHeightScale(waveHeight, waveHeightScaling) {
  let range,
    domain;
  if (waveHeightScaling) {
    range = [0, waveHeight, 0];
    domain = [0, 50, 100];
  } else {
    range = [waveHeight, waveHeight]
    domain = [0, 100];
  }
  return d3.scaleLinear().range(range).domain(domain);
}

// Rounding functions so that the correct number of decimal places
// is always displayed as the value counts up.
function setTextRounder(textFinalValue) {
  if (parseFloat(textFinalValue) != parseFloat(Math.round(textFinalValue))) {
    return function(value) {
      return parseFloat(value).toFixed(1);
    };
  }
  if (parseFloat(textFinalValue) != parseFloat(Math.round(textFinalValue))) {
    return function(value) {
      return parseFloat(value).toFixed(2);
    };
  }
  return function(value) {
    return Math.round(value);
  };
}

// Data for building the clip wave area.
function getClipWaveAreaData(waveClipCount) {
  let clipData = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    clipData.push({
      x: i / (40 * waveClipCount),
      y: (i / (40))
    });
  }
  return clipData;
}
