import { connect } from 'react-redux';
import GroupPage from '../../components/GroupPage/GroupPage';
import {
    startFetchDisabledGroups,
    startFetchEnabledGroups,
    toggleDisabledStatus,
    startDeleteGroup,
    startCreateGroup,
    startUpdateGroup,
    startClearGroup,
    selectGroup,
} from '../../actions/groups';

const mapStateToProps = (state) => ({
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    disabledGroups: state.groups.disabledGroups,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    loading: state.loadingIndicator.loading,
    enabledGroups: state.groups.groups,
    students: state.students.students,
    student: state.students.student,
    group: state.groups.group,
});

const mapDispatchToProps = {
    startFetchDisabledGroups,
    startFetchEnabledGroups,
    toggleDisabledStatus,
    startDeleteGroup,
    startCreateGroup,
    startUpdateGroup,
    startClearGroup,
    selectGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
