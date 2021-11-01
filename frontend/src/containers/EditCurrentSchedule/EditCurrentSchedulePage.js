import { connect } from 'react-redux';

import { getLessonsByGroup } from '../../actions';
import { clearScheduleStart, getAllScheduleItemsStart } from '../../actions/schedule';
import EditCurrentSchedulePage from '../../components/EditCurrentSchedule/EditCurrentSchedulePage';

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    lessons: state.lesson.lessons,
    groupId: state.lesson.groupId,
    loading: state.loadingIndicator.loading,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    scheduleItems: state.schedule.items,
    itemGroupId: state.schedule.itemGroupId,
    currentSemester: state.schedule.currentSemester,
    semester: state.schedule.semester,
});

const mapDispatchToProps = (dispatch) => ({
    getAllLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    clearScheduleItems: (id) => dispatch(clearScheduleStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCurrentSchedulePage);
