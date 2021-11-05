import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SEMESTER_FORM } from '../../constants/reduxForms';
import SemesterForm from '../../components/Semester/SemesterForm/SemesterForm';
import { clearSemester } from '../../actions/semesters';

const mapDispatchToProps = (dispatch) => ({
    clearSemester: () => dispatch(clearSemester()),
});

export default connect(
    null,
    mapDispatchToProps,
)(
    reduxForm({
        form: SEMESTER_FORM,
    })(SemesterForm),
);
