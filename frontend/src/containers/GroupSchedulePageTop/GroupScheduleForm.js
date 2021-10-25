import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import SchedulePageForm from '../../components/GroupSchedulePageTop/SchedulePageForm';
import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';

const mapStateToProps = (state) => ({
    semester: state.schedule.scheduleSemesterId,
    group: state.schedule.scheduleGroupId,
    teacher: state.schedule.scheduleTeacherId,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM,
    })(SchedulePageForm),
);
