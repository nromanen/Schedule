import {connect} from 'react-redux';

import {
    getLessonsByGroupStart,
    setLessonsCardsStart,
    setScheduleLoading,
    showAllGroupsSuccess,
    getGroupsForCurrentSemesterStart,
    selectGroupId
} from '../../actions';
import {getClassScheduleListStart} from '../../actions/classes';
import {clearScheduleStart, getAllScheduleItemsStart} from '../../actions/schedule';
import EditCurrentSchedulePage from '../../components/EditCurrentSchedule/EditCurrentSchedulePage';
import {getListOfRoomsStart} from '../../actions/rooms';

const mapStateToProps = (state) => ({
    groups: state.groups.scheduleGroups,
    lessons: state.lesson.lessons,
    groupId: state.lesson.groupId,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    scheduleItems: state.schedule.items,
    itemGroupId: state.schedule.itemGroupId,
    currentSemester: state.schedule.currentSemester,
    semester: state.schedule.semester,
});

const mapDispatchToProps = (dispatch) => ({
    getEnabledGroups: () => dispatch(getGroupsForCurrentSemesterStart()),
    getAllLessonsByGroup: (groupId) => dispatch(getLessonsByGroupStart(groupId)),
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    clearScheduleItems: (id) => dispatch(clearScheduleStart(id)),
    setScheduleLoading: (newState) => dispatch(setScheduleLoading(newState)),
    showAllGroups: () => dispatch(showAllGroupsSuccess()),
    getClassScheduleList: () => dispatch(getClassScheduleListStart()),
    getListOfRooms: () => dispatch(getListOfRoomsStart()),
    setLessonsCards: (lessons) => dispatch(setLessonsCardsStart(lessons)),
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCurrentSchedulePage);
