import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import {
    clearGroupStart,
    deleteGroupStart,
    fetchDisabledGroupsStart,
    fetchEnabledGroupsStart,
    selectGroupSuccess,
    toggleDisabledStatus,
} from '../../actions/groups';
import { deleteStudentStart } from '../../actions/students';
import GroupPage from '../../components/GroupPage/GroupPage';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    loading: state.loadingIndicator.loading,
    groups: state.groups.groups,
});

const mapDispatchToProps = {
    fetchDisabledGroupsStart,
    fetchEnabledGroupsStart,
    setIsOpenConfirmDialog,
    toggleDisabledStatus,
    deleteStudentStart,
    deleteGroupStart,
    clearGroupStart,
    selectGroupSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
