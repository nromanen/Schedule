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
    disabledGroups: state.groups.disabledGroups,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    loading: state.loadingIndicator.loading,
    groups: state.groups.groups,
    students: state.students.students,
    student: state.students.student,
    group: state.groups.group,
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
