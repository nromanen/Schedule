import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SEMESTER_COPY_FORM } from '../../constants/reduxForms';
import SemesterCopyForm from '../../components/Semester/SemesterCopyForm/SemesterCopyForm';

const mapStateToProps = (state) => ({
    semesters: state.semesters.semesters,
});
export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_COPY_FORM,
    })(SemesterCopyForm),
);
