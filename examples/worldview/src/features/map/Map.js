// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import {nearestEven} from '../../utils';
import isEqual from 'lodash.isequal';

function DebugOverlay({containerRef, deckRef, dimension, expectedContainer, dpi, onDpiChange}) {
  const container = containerRef.current;
  const deck = deckRef.current;
  const canvas = deck && deck._canvasRef.current;
  const canvasRect = canvas && canvas.getBoundingClientRect();
  const gl = deck && deck.deck.animationLoop && deck.deck.animationLoop.gl;

  return (
    <div style={{position: 'absolute', top: 0, left: 0, color: 'white'}}>
      <div>
        Expected Export size: <b>{dimension.width}</b>px x <b>{dimension.height}</b>px
      </div>
      <div>
        Expected Container size: <b>{expectedContainer.width}</b>px x{' '}
        <b>{expectedContainer.height}</b>px
      </div>
      {container && (
        <div>
          Container CSS size: <b>{container.clientWidth}</b>px x <b>{container.clientHeight}</b>px
        </div>
      )}
      {canvas && (
        <div>
          Canvas CSS size: <b>{canvas.clientWidth}</b>px x <b>{canvas.clientHeight}</b>px
        </div>
      )}
      {canvas && (
        <div>
          Canvas internal size: <b>{canvas.width}</b>px x <b>{canvas.height}</b>px
        </div>
      )}
      {gl && (
        <div>
          GL draw buffer size: <b>{gl.drawingBufferWidth}</b>px x <b>{gl.drawingBufferHeight}</b>px
        </div>
      )}
      {canvasRect && (
        <div>
          Canvas rect size: <b>{canvasRect.width}</b>px x <b>{canvasRect.height}</b>px
        </div>
      )}
      <div>
        pixel ratio: <b>{window.devicePixelRatio}</b>
      </div>
      <div>
        <input
          type="range"
          min={0.01}
          max={5.0}
          step={0.01}
          value={dpi}
          onChange={e => onDpiChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

export class Map extends Component {
  constructor(props) {
    super(props);

    this.mapRef = React.createRef();
    this.deckRef = React.createRef();
    this.containerRef = React.createRef();

    this.state = {
      glContext: undefined,
      memoDevicePixelRatio: window.devicePixelRatio, // memoize
      dpi: 1
    };

    this._onMapLoad = this._onMapLoad.bind(this);
    this._resizeVideo = this._resizeVideo.bind(this);
    this._resizeMap = this._resizeMap.bind(this);
    this._changeDpi = this._changeDpi.bind(this);

    this._resizeVideo();
  }

  componentDidUpdate(prevProps) {
    const {dimension, width, height} = this.props;
    if (
      !isEqual(prevProps.dimension, dimension) ||
      prevProps.width !== width ||
      prevProps.height !== height
    ) {
      this._resizeVideo();
    }
  }

  componentWillUnmount() {
    const {memoDevicePixelRatio} = this.state;
    this._setDevicePixelRatio(memoDevicePixelRatio);
  }

  _resizeMap() {
    if (this.mapRef.current) {
      const map = this.mapRef.current.getMap();
      map.resize();
    }
  }

  _resizeVideo() {
    const {width, dimension} = this.props;
    this._changeDpi(nearestEven(dimension.width / width));
  }

  _changeDpi(dpi) {
    this._setDevicePixelRatio(dpi);
    this._resizeMap();
    this.setState({dpi});
  }

  _setDevicePixelRatio(devicePixelRatio) {
    /**
     * TODO: This is the only way to trick mapbox into scaling its render buffer up
     * to match the desired resolution. It is built to always fit it's render buffer size
     * to it's CSS container size, which makes it impossible to make a small "preview" box.
     *
     * deck.gl has the useDevicePixels prop, which would have been used if it also changed mapbox.
     * https://github.com/visgl/luma.gl/pull/1155 for background.
     *
     * Compare implementations of luma.gl to mapbox for context:
     * https://github.com/visgl/luma.gl/blob/f622105e30c4dcda434f80ebc4680356003b12fa/modules/gltools/src/utils/device-pixels.js#L31
     * https://github.com/mapbox/mapbox-gl-js/blob/3136a53235cf17b732e84c9945c4e85ba3369a93/src/ui/map.js#L2324
     *
     * In luma the scaler can be overriden by useDevicePixels.
     *
     * The workaround is to change window.devicePixelRatio while the component is mounted to scale up the render buffers of deck and mapbox.
     * This is hacky and can cause issues in certain applications. We should try to produce a better solution.
     */
    // @ts-ignore
    window.devicePixelRatio = devicePixelRatio;
  }

  _onMapLoad() {
    const {
      adapter,
      deckProps: {layers},
      updateTimeCursor
    } = this.props;
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();
    const deck = this.deckRef.current.deck;

    // var mapboxLayers = map.getStyle().layers;
    // console.log(mapboxLayers)

    // If there aren't any layers, combine map and deck with a fake layer.
    if (!layers.length) {
      map.addLayer(new MapboxLayer({id: '%%blank-layer', deck}));
    }

    for (let i = 0; i < layers.length; i++) {
      // TODO: layer mapbox and deck layers in order according to kepler config.
      // map.addLayer(new MapboxLayer({id: layers[i].id, deck}), "tunnel-simple");

      // Adds DeckGL layers to Mapbox so Mapbox can be the bottom layer. Removing this clips DeckGL layers
      map.addLayer(new MapboxLayer({id: layers[i].id, deck}));
    }

    map.on('render', () =>
      adapter.onAfterRender(timeMs => {
        updateTimeCursor(timeMs);
      })
    );
  }

  render() {
    const {
      adapter,
      viewState,
      width,
      height,
      setViewState,
      deckProps,
      staticMapProps,
      dimension,
      debug
    } = this.props;
    const {glContext, dpi} = this.state;
    const deck = this.deckRef.current && this.deckRef.current.deck;

    const deckStyle = {
      width: '100%',
      height: '100%'
    };

    const containerStyle = {
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative'
    };

    return (
      <div ref={this.containerRef} id="deck-canvas" style={containerStyle}>
        <DeckGL
          ref={this.deckRef}
          viewState={{...viewState, maxPitch: 90}}
          id="hubblegl-overlay"
          style={deckStyle}
          controller={true}
          glOptions={{stencil: true}}
          onWebGLInitialized={gl => this.setState({glContext: gl})}
          onViewStateChange={({viewState: vs}) => setViewState(vs)}
          width={dimension.width}
          height={dimension.height}
          {...adapter.getProps({deck, extraProps: deckProps})}
        >
          {glContext && (
            <StaticMap
              ref={this.mapRef}
              preventStyleDiffing={true}
              gl={glContext}
              onLoad={this._onMapLoad}
              {...staticMapProps}
            />
          )}
        </DeckGL>
        {debug && (
          <DebugOverlay
            deckRef={this.deckRef}
            containerRef={this.containerRef}
            dimension={dimension}
            expectedContainer={{width, height}}
            dpi={dpi}
            onDpiChange={this._changeDpi}
          />
        )}
      </div>
    );
  }
}
