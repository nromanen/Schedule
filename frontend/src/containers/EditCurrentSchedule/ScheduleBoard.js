import { connect } from 'react-redux';
import { checkAvailabilityScheduleStart } from '../../actions/schedule';
import ScheduleBoard from '../../components/EditCurrentSchedule/ScheduleBord/ScheduleBoard';

const mapStateToProps = (state) => ({
    scheduleItems: state.schedule.items,
});
const mapDispatchToProps = (dispatch) => ({
    checkScheduleItemAvailability: (item) => dispatch(checkAvailabilityScheduleStart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBoard);
