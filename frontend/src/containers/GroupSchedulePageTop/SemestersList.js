import { connect } from 'react-redux';
import { getAllPublicGroupsStart } from '../../actions/schedule';
import SemestersList from '../../components/GroupSchedulePageTop/SemestersList';

const mapStateToProps = (state) => ({
    semesters: state.schedule.semesters,
    scheduleSemesterId: state.schedule.scheduleSemesterId,
});

const mapDispatchToProps = (dispatch) => ({
    getAllGroups: (id) => dispatch(getAllPublicGroupsStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemestersList);
