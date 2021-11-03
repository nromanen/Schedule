import { connect } from 'react-redux';
import ShowStudentsOnGroupDialog from '../../share/DialogWindows/_dialogWindows/ShowStudentsOnGroupDialog';
import { fetchAllStudentsStart } from '../../actions/students';

const mapStateToProps = (state) => ({
    students: state.students.students,
    student: state.students.student,
    groups: state.groups.groups,
    group: state.groups.group,
});

export default connect(mapStateToProps, { fetchAllStudentsStart })(ShowStudentsOnGroupDialog);
