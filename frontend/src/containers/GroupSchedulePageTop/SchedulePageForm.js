import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import {
    getAllPublicSemestersRequested,
    getAllPublicTeachersRequested,
} from '../../actions/schedule';
import SchedulePageForm from '../../components/GroupSchedulePageTop/SchedulePageForm';
import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';

const mapStateToProps = (state) => ({
    semester: state.schedule.scheduleSemesterId,
    group: state.schedule.scheduleGroupId,
    teacher: state.schedule.scheduleTeacherId,
});

const mapDispatchToProps = (dispatch) => ({
    getAllPublicTeachers: () => dispatch(getAllPublicTeachersRequested()),
    getAllPublicSemesters: () => dispatch(getAllPublicSemestersRequested()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM,
    })(SchedulePageForm),
);
