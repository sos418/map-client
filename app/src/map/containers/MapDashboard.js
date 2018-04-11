import { connect } from 'react-redux';
import MapDashboard from 'map/components/MapDashboard';
import { trackExternalLinkClicked } from 'analytics/analyticsActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';

const mapStateToProps = state => ({
  isEmbedded: state.app.isEmbedded,
  zoom: state.mapViewport.viewport.zoom,
  latitude: state.mapViewport.viewport.latitude,
  longitude: state.mapViewport.viewport.longitude
  // activeBasemap: state.basemap.activeBasemap,
  // areas: state.areas.existingAreasOfInterest,
  // basemaps: state.basemap.basemaps,
  // isDrawing: state.map.isDrawing,
  // showMapCursorPointer: state.heatmap.highlightedVessels.isEmpty !== true && state.heatmap.highlightedVessels.clickableCluster !== true,
  // showMapCursorZoom: state.heatmap.highlightedVessels.clickableCluster === true,
  // token: state.user.token,
  // trackBounds: state.vesselInfo.trackBounds,
  // userPermissions: state.user.userPermissions,
});

const mapDispatchToProps = dispatch => ({
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  onExternalLink: (link) => {
    dispatch(trackExternalLinkClicked(link));
  }
  // toggleLayerVisibility: (layer) => {
  //   dispatch(toggleLayerVisibility(layer));
  // },
  //
  // hidePolygonModal: () => {
  //   dispatch(hidePolygonModal());
  // },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapDashboard);