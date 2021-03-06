import {
  SET_VIEWPORT,
  UPDATE_VIEWPORT,
  SET_ZOOM_INCREMENT,
  SET_MOUSE_LAT_LONG,
  TRANSITION_END,
  SET_NATIVE_VIEWPORT
} from 'map/mapViewportActions';

import { FlyToInterpolator } from 'react-map-gl';
import { easeCubic } from 'd3-ease';
import { MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from 'config';
import { TRANSITION_TYPE } from 'constants';
import defaultWorkspace from 'workspace/workspace';

const DEFAULT_TRANSITION = {
  transitionDuration: 500,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: easeCubic
};

const initialState = {
  viewport: {
    latitude: defaultWorkspace.workspace.map.center[0],
    longitude: defaultWorkspace.workspace.map.center[1],
    zoom: defaultWorkspace.workspace.map.zoom - 1,
    bearing: 0,
    pitch: 0,
    width: 1000,
    height: 800
  },
  maxZoom: MAX_ZOOM_LEVEL,
  minZoom: MIN_ZOOM_LEVEL,
  prevZoom: 3,
  currentTransition: null,
  canZoomIn: false,
  canZoomOut: false,
  mouseLatLong: { lat: 0, long: 0 }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload,
        canZoomIn: action.payload.zoom < state.maxZoom,
        canZoomOut: action.payload.zoom > state.minZoom,
        prevZoom: state.viewport.zoom
      };
    }

    case UPDATE_VIEWPORT: {
      const viewport = { ...state.viewport, ...action.payload };
      return {
        ...state,
        viewport,
        prevZoom: viewport.zoom
      };
    }

    case SET_ZOOM_INCREMENT: {
      const currentZoom = state.viewport.zoom;
      const zoom = Math.min(state.maxZoom, action.payload.zoom || currentZoom + action.payload.increment);
      const viewport = {
        ...state.viewport,
        ...DEFAULT_TRANSITION,
        zoom,
        latitude: (action.payload.latitude === undefined) ? state.viewport.latitude : action.payload.latitude,
        longitude: (action.payload.longitude === undefined) ? state.viewport.longitude : action.payload.longitude
      };
      return {
        ...state,
        viewport,
        canZoomIn: zoom < state.maxZoom,
        canZoomOut: zoom > state.minZoom,
        prevZoom: state.viewport.zoom,
        currentTransition: TRANSITION_TYPE.ZOOM
      };
    }

    case SET_MOUSE_LAT_LONG: {
      const mouseLatLong = {
        lat: action.payload.lat,
        long: action.payload.long
      };

      return { ...state, mouseLatLong };
    }

    case TRANSITION_END: {
      return { ...state, currentTransition: null };
    }

    case SET_NATIVE_VIEWPORT: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}
