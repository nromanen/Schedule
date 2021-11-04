import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { STUDENT_FORM } from '../../constants/reduxForms';
import { AddStudentForm } from '../../components/AddStudentForm/AddStudentForm';

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    group: state.groups.group,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: STUDENT_FORM,
    })(AddStudentForm),
);
