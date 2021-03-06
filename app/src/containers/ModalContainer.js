import { connect } from 'react-redux';
import ModalContainer from 'components/ModalContainer';
import { setLayerInfoModal, setLayerManagementModalVisibility } from 'app/appActions';
import { deleteWorkspace } from 'workspace/workspaceActions';
import { setWelcomeModalVisibility } from 'welcomeModal/welcomeModalActions';
import { confirmLayerRemoval } from 'layers/layersActions';
import { setSearchModalVisibility } from 'search/searchActions';
import { setRecentVesselsModalVisibility } from 'recentVessels/recentVesselsActions';
import { openShareModal, setShareModalError } from 'share/shareActions';
import { setSupportModalVisibility } from 'siteNav/supportFormActions';
import { setFilterGroupModalVisibility, setEditFilterGroupIndex } from 'filters/filterGroupsActions';
import { discardCurrentEdits } from 'fleets/fleetsActions';
import { toggleSubscriptionModalVisibility, toggleReportPanelVisibility } from 'report/reportActions';
import isEmpty from 'lodash/isEmpty';

const mapStateToProps = state => ({
  isFilterGroupModalOpen: state.filterGroups.isFilterGroupModalOpen,
  isFleetsModalOpen: state.fleets.isFleetsModalOpen,
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval,
  layerManagementModal: state.app.layerManagementModal.open,
  layerModal: state.app.layerModal,
  recentVesselModalOpen: state.recentVessels.recentVesselModal.open,
  reportHasPolygon: !isEmpty(state.report.currentPolygon),
  searchModalOpen: state.search.searchModalOpen,
  shareModalOpenState: state.share.shareModal.open,
  subscriptionModalOpen: state.report.showSubscriptionModal,
  supportFormModalOpen: state.supportForm.open,
  token: state.user.token,
  userPermissions: state.user.userPermissions,
  welcomeModalOpen: state.welcomeModal.open,
  isEmbedded: state.app.isEmbedded
});

const mapDispatchToProps = dispatch => ({
  closeShareModal: () => {
    dispatch(openShareModal(false));
    dispatch(deleteWorkspace());
    dispatch(setShareModalError(null));
  },
  closeLayerInfoModal: () => {
    dispatch(setLayerInfoModal({
      open: false
    }));
  },
  closeSupportModal: () => {
    dispatch(setSupportModalVisibility(false));
  },
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true));
  },
  closeLayerManagementModal: () => {
    dispatch(setLayerManagementModalVisibility(false));
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false));
  },
  closeRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(false));
  },
  closeWelcomeModal: () => {
    dispatch(setWelcomeModalVisibility(false));
  },
  closeLayerRemovalModal: () => {
    dispatch(confirmLayerRemoval(false));
  },
  closeSubscriptionModal: () => {
    dispatch(toggleSubscriptionModalVisibility(false));
    dispatch(toggleReportPanelVisibility());
  },
  closeFilterGroupModal: () => {
    dispatch(setFilterGroupModalVisibility(false));
    dispatch(setEditFilterGroupIndex(null));
  },
  closeFleetsModal: () => {
    dispatch(discardCurrentEdits());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer);
