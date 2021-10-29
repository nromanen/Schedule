import { connect } from 'react-redux';
import GroupPage from '../../components/GroupPage/GroupPage';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import { deleteStudentStart } from '../../actions/students';
import {
    fetchDisabledGroupsStart,
    fetchEnabledGroupsStart,
    toggleDisabledStatus,
    deleteGroupStart,
    createGroupStart,
    updateGroupStart,
    clearGroupStart,
    selectGroup,
} from '../../actions/groups';

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
    createGroupStart,
    updateGroupStart,
    clearGroupStart,
    selectGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
