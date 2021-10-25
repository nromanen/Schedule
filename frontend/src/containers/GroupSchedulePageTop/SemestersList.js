import { connect } from 'react-redux';
import SemestersList from '../../components/GroupSchedulePageTop/SemestersList';

const mapStateToProps = (state) => ({
    semesters: state.schedule.semesters,
    scheduleSemesterId: state.schedule.scheduleSemesterId,
});

export default connect(mapStateToProps)(SemestersList);
