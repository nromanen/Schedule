import { connect } from 'react-redux';
import GroupList from '../../components/GroupList/GroupList';

const mapStateToProps = (state) => ({
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    disabledGroups: state.groups.disabledGroups,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    loading: state.loadingIndicator.loading,
    enabledGroups: state.groups.groups,
    group: state.groups.group,
    students: state.students.students,
    student: state.students.student,
});

export default connect(mapStateToProps, {})(GroupList);
