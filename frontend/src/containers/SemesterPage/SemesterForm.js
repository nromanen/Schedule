import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SEMESTER_FORM } from '../../constants/reduxForms';
import SemesterForm from '../../components/Semester/SemesterForm/SemesterForm';

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
});
export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_FORM,
    })(SemesterForm),
);
