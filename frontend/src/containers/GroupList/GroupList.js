import { connect } from 'react-redux';
import GroupPage from '../../components/GroupPage/GroupPage';
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
    toggleDisabledStatus,
    deleteGroupStart,
    createGroupStart,
    updateGroupStart,
    clearGroupStart,
    selectGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
