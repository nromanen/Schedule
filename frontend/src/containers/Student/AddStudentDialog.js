import { connect } from 'react-redux';
import { AddStudentDialog } from '../../share/DialogWindows';

const mapStateToProps = (state) => ({
    student: state.students.student,
    groups: state.groups.groups,
});

export default connect(mapStateToProps, {})(AddStudentDialog);
