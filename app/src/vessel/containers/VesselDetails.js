import { connect } from 'react-redux';
import VesselDetails from 'vessel/components/VesselDetails';

const mapStateToProps = (state, ownProps) => {
  const currentlyShownLayer = state.layers.workspaceLayers
    .find(layer => layer.tilesetId === ownProps.tilesetId);

  let layerFieldsHeaders;
  if (
    currentlyShownLayer !== undefined &&
    currentlyShownLayer.header !== undefined &&
    currentlyShownLayer.header.vesselFields !== undefined
  ) {
    layerFieldsHeaders = currentlyShownLayer.header.vesselFields;
  }
  return {
    currentlyShownVessel: state.vesselInfo.currentlyShownVessel,
    layerFieldsHeaders
  };
};

export default connect(mapStateToProps)(VesselDetails);
