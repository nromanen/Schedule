import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { getAllPublicSemestersStart, getAllPublicTeachersStart } from '../../actions/schedule';
import SchedulePageForm from '../../components/GroupSchedulePageTop/SchedulePageForm';
import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';

const mapStateToProps = (state) => ({
    semester: state.schedule.scheduleSemesterId,
    group: state.schedule.scheduleGroupId,
    teacher: state.schedule.scheduleTeacherId,
});

const mapDispatchToProps = (dispatch) => ({
    getAllPublicTeachers: () => dispatch(getAllPublicTeachersStart()),
    getAllPublicSemesters: () => dispatch(getAllPublicSemestersStart()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM,
    })(SchedulePageForm),
);
