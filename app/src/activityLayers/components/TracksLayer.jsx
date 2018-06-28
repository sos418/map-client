/* global PIXI */
import 'pixi.js';
import React from 'react';
import PropTypes from 'prop-types';
import { worldToPixels } from 'viewport-mercator-project';
import {
  TRACKS_DOTS_STYLE_ZOOM_THRESHOLD
} from 'config';

class TracksLayer extends React.Component {
  componentDidMount() {
    this._build();
  }

  componentDidUpdate() {
    this._redraw();
  }

  _build() {
    const { rootStage } = this.props;
    this.stage = new PIXI.Graphics();
    this.stage.nativeLines = true;
    rootStage.addChild(this.stage);
  }

  clear() {
    this.stage.clear();
  }

  _redraw() {
    const { tracks, zoom, startIndex, endIndex, timelineOverExtentIndexes } = this.props;

    this.clear();
    if (!tracks.length) {
      return;
    }

    const overInInner = (timelineOverExtentIndexes === undefined) ? undefined : [
      Math.max(startIndex, timelineOverExtentIndexes[0]),
      Math.min(endIndex, timelineOverExtentIndexes[1])
    ];
    const overExtent = (overInInner && overInInner[1] - overInInner[0] > 0) ? overInInner : undefined;

    let n = 0; // eslint-disable-line no-unused-vars

    const drawFishingCircles = zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD;
    const fishingCirclesRadius = 1 + ((zoom - TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) * 0.5);
    const drawOverTrack = overExtent !== undefined &&
        overExtent[0] > 0 && overExtent[1] > 0;

    tracks.forEach((track) => {
      n += this._drawTrack({
        data: track.data,
        startIndex,
        endIndex,
        series: track.selectedSeries,
        drawFishingCircles,
        fishingCirclesRadius,
        color: `0x${track.color.substr(1)}`,
        lineThickness: 1,
        lineOpacity: 1
      });

      // Draw the highlight over the track when the user hovers over the Timebar
      if (drawOverTrack === true) {
        n += this._drawTrack({
          data: track.data,
          startIndex: timelineOverExtentIndexes[0],
          endIndex: timelineOverExtentIndexes[1],
          series: track.selectedSeries,
          drawFishingCircles,
          fishingCirclesRadius,
          color: '0xFFFFFF',
          lineThickness: 2,
          lineOpacity: 1
        });
      }
    });

    // console.log(n);
  }

  /**
   * Draws a single track (line + points)
   *
   * @param data track points data in 'playback form' (ie organized by days)
   * @param extent extent, in day indices
   * @param series (optional) used to filter points by series
   * @param offset object containing info about the current situation of the map viewport, used to compute screen coords
   * @param drawFishingCircles whether to draw fishing circles or not
   * @param fishingCirclesRadius radius of the fishing circles
   * @param color
   * @param lineThickness
   * @param lineOpacity
   */
  _drawTrack({ data, startIndex, endIndex, series, drawFishingCircles, fishingCirclesRadius, color, lineThickness, lineOpacity, worldOffset = 0
   }) {
    const { viewport, viewportLeft, viewportRight } = this.props;

    let n = 0;
    let prevSeries;
    let prevWorldX;
    let prevWorldY;

    const circlePoints = {
      x: [],
      y: []
    };

    let finalColor = color;
    if (worldOffset !== 0) {
      if (color === '0xFF0000') finalColor = '0x00ff00';
      else finalColor = '0x68B300';
    }

    this.stage.lineStyle(lineThickness, finalColor, lineOpacity);

    const deltas = [];
    // let offsetX = 0;    // console.log('left active', viewportLeft > 0)

    // const viewportRightMod = viewportRight % 512;
    // const lessThanOneWorld = (viewportRight - viewportLeft) < 512;

    let duplicateWorld = false;

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let i = 0, len = frame.series.length; i < len; i++) {
        const currentSeries = frame.series[i];
        if (series && series !== currentSeries) {
          continue;
        }

        n++;
        
        const worldX = frame.worldX[i] + worldOffset;
        const worldY = frame.worldY[i];
        // // if (viewportLeft > 0 && offsetedWorldX > 0 && offsetedWorldX < viewportRight) {
        // //   offsetedWorldX += 512;
        // // } else if (viewportLeft < 0 && offsetedWorldX > viewportLeft && offsetedWorldX < 512) {
        // //   offsetedWorldX -= 512;
        // // }

        // if (viewportLeft > 0) {
        //   // left half is active
        //   if (lessThanOneWorld) {
        //     if (offsetedWorldX < viewportRightMod) {
        //       offsetedWorldX += 512;
        //     }
        //   } else {
            
        //   }
        // }

        // if (prevX) {
        //   const delta = frame.worldX[i] - prevX;
        //   // if (Math.abs(delta) > 256) {
        //   //   if (viewportLeft > 0) {
        //   //     // offsetedWorldX += 512;
        //   //   } else {
        //   //     // offsetedWorldX -= 512;
        //   //   }
        //   // }
        //   deltas.push([frame.worldX[i], offsetedWorldX, frame.worldX[i] - prevX]);
        // }
        
        const [x, y] = worldToPixels(
          [worldX * viewport.scale, worldY * viewport.scale],
          viewport.pixelProjectionMatrix
        );
       
        if (prevSeries !== currentSeries) {
          this.stage.moveTo(x, y);
        }
        
        deltas.push([Math.abs(worldX - prevWorldX), worldX])
        if (prevWorldX && Math.abs(worldX - prevWorldX) > 256) {
          console.log(worldOffset)
          if (worldOffset === 0) {
            duplicateWorld = true;
          }
          const midWorldY = prevWorldY + ((worldY - prevWorldY) / 2);
          const isWestToEast = (worldX - prevWorldX) < 0;
          const midWorldX1 = (isWestToEast) ? 512 + worldOffset - 0.000001 : worldOffset;
          const midWorldX2 = (isWestToEast) ? worldOffset : 512 + worldOffset - 0.000001;
          const [x1, y1] = worldToPixels(
            [midWorldX1 * viewport.scale, midWorldY * viewport.scale],
            viewport.pixelProjectionMatrix
          );
          this.stage.lineTo(x1, y1);
          const [x2, y2] = worldToPixels(
            [midWorldX2 * viewport.scale, midWorldY * viewport.scale],
            viewport.pixelProjectionMatrix
          );
          this.stage.moveTo(x2, y2);
          deltas.push([prevWorldX, midWorldX1, midWorldX2, worldX])
        }

        // if (worldOffset !== 0) {
        this.stage.lineTo(x, y);
        // }
        
        if (drawFishingCircles && frame.hasFishing[i] === true) {
          circlePoints.x.push(x);
          circlePoints.y.push(y);
        }
        
        prevWorldX = worldX;
        prevWorldY = worldY;
        prevSeries = currentSeries;
      }
    }

    if (worldOffset !== 0) {

      console.log(viewportLeft, viewportRight, color);

      console.log(deltas)
    }

    if (drawFishingCircles) {
      this.stage.lineStyle(0);
      this.stage.beginFill(color, 1);
      for (let i = 0, circlesLength = circlePoints.x.length; i < circlesLength; i++) {
        this.stage.drawCircle(circlePoints.x[i], circlePoints.y[i], fishingCirclesRadius);
      }
      this.stage.endFill();
    }

    if (duplicateWorld === true) {
      const nextWorldOffset = (viewportLeft > 0) ? 512 : -512;
      console.log('duplicating world', nextWorldOffset);
      this._drawTrack({ worldOffset: nextWorldOffset, data, startIndex, endIndex, series, drawFishingCircles, fishingCirclesRadius, color, lineThickness, lineOpacity });
    }
    return n;
  }

  render() {
    return null;
  }
}

TracksLayer.propTypes = {
  zoom: PropTypes.number,
  rootStage: PropTypes.object,
  viewport: PropTypes.object,
  startIndex: PropTypes.number,
  endIndex: PropTypes.number,
  timelineOverExtentIndexes: PropTypes.array,
  tracks: PropTypes.array
};

export default TracksLayer;
