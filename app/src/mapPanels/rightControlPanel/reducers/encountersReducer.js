import { INFO_STATUS } from 'constants';
import {
  LOAD_ENCOUNTERS_INFO,
  SET_ENCOUNTERS_INFO,
  SET_ENCOUNTERS_VESSEL_INFO,
  CLEAR_ENCOUNTERS_INFO
} from 'mapPanels/rightControlPanel/actions/encounters';


const initialState = {
  encountersInfo: null,
  infoPanelStatus: INFO_STATUS.HIDDEN
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADING
      });
    }

    case SET_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.LOADED,
        encountersInfo: action.payload.encounterInfo
      });
    }

    case SET_ENCOUNTERS_VESSEL_INFO: {
      const encountersInfo = Object.assign({}, state.encountersInfo);
      const newVessel = encountersInfo.vessels.find(vessel => vessel.seriesgroup === action.payload.seriesgroup);
      newVessel.info = action.payload.info;
      return Object.assign({}, state, {
        encountersInfo
      });
    }

    case CLEAR_ENCOUNTERS_INFO: {
      return Object.assign({}, state, {
        infoPanelStatus: INFO_STATUS.HIDDEN,
        encountersInfo: null
      });
    }

    default:
      return state;
  }
}
