import {connect} from 'react-redux';
import {checkAvailabilityChangeRoomScheduleStart, deleteScheduleItemStart,} from '../../actions/schedule';
import {getLessonsByGroupStart, selectGroupId} from '../../actions';
import ScheduleLessonsList from '../../components/EditCurrentSchedule/ScheduleLessonList/ScheduleLessonList';

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    lessons: state.lesson.lessons,
    items: state.schedule.items,
});

const mapDispatchToProps = (dispatch) => ({
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
    checkRoomAvailability: (item) => dispatch(checkAvailabilityChangeRoomScheduleStart(item)),
    deleteScheduleItem: (item) => dispatch(deleteScheduleItemStart(item)),
    getLessonsByGroupId: (id) => dispatch(getLessonsByGroupStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleLessonsList);
