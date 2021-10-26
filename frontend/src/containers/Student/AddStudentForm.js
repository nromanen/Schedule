import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { STUDENT_FORM } from '../../constants/reduxForms';
import { AddStudentForm } from '../../components/AddStudentForm/AddStudentForm';

const mapStateToProps = (state) => ({
    student: state.students.student,
    groups: state.groups.groups,
    group: state.groups.group,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: STUDENT_FORM,
    })(AddStudentForm),
);
