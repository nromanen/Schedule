import { connect } from 'react-redux';
import { AddStudentDialog } from '../../share/DialogWindows';
import { startCreateStudent, startUpdateStudent } from '../../actions/students';

const mapStateToProps = (state) => ({
    student: state.students.student,
    groups: state.groups.groups,
});

export default connect(mapStateToProps, { startCreateStudent, startUpdateStudent })(
    AddStudentDialog,
);
