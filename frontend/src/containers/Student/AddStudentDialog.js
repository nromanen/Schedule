import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { STUDENT_FORM } from '../../constants/reduxForms';
import { AddStudentDialog } from '../../share/DialogWindows';

const mapStateToProps = (state) => ({
    student: state.students.student,
    groups: state.groups.groups,
});

const AddStudentDialogForm = reduxForm({
    form: STUDENT_FORM,
})(AddStudentDialog);

export default connect(mapStateToProps, {})(AddStudentDialogForm);
