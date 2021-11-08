import { connect } from 'react-redux';
import ShowStudentsOnGroupDialog from '../../share/DialogWindows/_dialogWindows/ShowStudentsOnGroupDialog';
import { getAllStudentsStart } from '../../actions/students';

const mapStateToProps = (state) => ({
    loading: state.loadingIndicator.studentsLoading,
    students: state.students.students,
    groups: state.groups.groups,
    group: state.groups.group,
});

export default connect(mapStateToProps, { getAllStudentsStart })(ShowStudentsOnGroupDialog);
