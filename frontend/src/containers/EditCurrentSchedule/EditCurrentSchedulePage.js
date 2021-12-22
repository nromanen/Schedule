import { connect } from 'react-redux';

import {
    getLessonsByGroupStart,
    setScheduleLoading,
    showAllGroupsSuccess,
    getAllPublicGroupsStart,
} from '../../actions';
import { getClassScheduleListStart } from '../../actions/classes';
import { clearScheduleStart, getAllScheduleItemsStart } from '../../actions/schedule';
import EditCurrentSchedulePage from '../../components/EditCurrentSchedule/EditCurrentSchedulePage';
import { getListOfRoomsStart } from '../../actions/rooms';

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    lessons: state.lesson.lessons,
    groupId: state.lesson.groupId,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    scheduleItems: state.schedule.items,
    itemGroupId: state.schedule.itemGroupId,
    currentSemester: state.schedule.currentSemester,
    semester: state.schedule.semester,
});

const mapDispatchToProps = (dispatch) => ({
    getAllLessonsByGroup: (groupId) => dispatch(getLessonsByGroupStart(groupId)),
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    clearScheduleItems: (id) => dispatch(clearScheduleStart(id)),
    setScheduleLoading: (newState) => dispatch(setScheduleLoading(newState)),
    showAllGroups: () => dispatch(showAllGroupsSuccess()),
    getClassScheduleList: () => dispatch(getClassScheduleListStart()),
    getListOfRooms: () => dispatch(getListOfRoomsStart()),
    getAllPublicGroupsStart: (id) => dispatch(getAllPublicGroupsStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCurrentSchedulePage);
