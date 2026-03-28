import {connect} from 'react-redux';
import {
    checkAvailabilityChangeRoomScheduleStart,
    deleteScheduleItemStart,
} from '../../actions/schedule';
import {getLessonsByGroupStart, selectGroupId} from '../../actions';
import ScheduleBoardItem from '../../components/EditCurrentSchedule/ScheduleBoard/ScheduleBoardItem';
import { moveScheduleItemStart } from '../../actions/schedule';

const mapStateToProps = (state) => ({
    scheduleItems: state.schedule.items,
    currentSemester: state.schedule.currentSemester,
});
const mapDispatchToProps = (dispatch) => ({
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
    checkRoomAvailability: (item) => dispatch(checkAvailabilityChangeRoomScheduleStart(item)),
    deleteScheduleItem: (item) => dispatch(deleteScheduleItemStart(item)),
    getLessonsByGroupId: (id) => dispatch(getLessonsByGroupStart(id)),
    moveScheduleItem: (item) => dispatch(moveScheduleItemStart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBoardItem);
