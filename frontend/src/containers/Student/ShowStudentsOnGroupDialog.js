import { connect } from 'react-redux';
import { ShowStudentsOnGroupDialog } from '../../share/DialogWindows';
import { showAllStudentsByGroupId, fetchAllStudents } from '../../actions/students';

const mapStateToProps = (state) => ({
    studentsByGroup: state.students.studentsByGroup,
    students: state.students.students,
    student: state.students.student,
    groups: state.groups.groups,
});

export default connect(mapStateToProps, { showAllStudentsByGroupId, fetchAllStudents })(
    ShowStudentsOnGroupDialog,
);
