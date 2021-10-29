import { connect } from 'react-redux';
import {
    getDefaultSemesterRequsted,
    setScheduleSemesterId,
    setScheduleType,
    setScheduleGroupId,
    setScheduleTeacherId,
    getGroupScheduleStart,
    getTeacherScheduleStart,
    getFullScheduleStart,
} from '../../actions/schedule';
import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

const mapStateToProps = (state) => ({
    scheduleType: state.schedule.scheduleType,
    groupSchedule: state.schedule.groupSchedule,
    fullSchedule: state.schedule.fullSchedule,
    teacherSchedule: state.schedule.teacherSchedule,
    groupId: state.schedule.scheduleGroupId,
    teacherId: state.schedule.scheduleTeacherId,
    semesterId: state.schedule.scheduleSemesterId,
    loading: state.loadingIndicator.mainScheduleLoading,
    defaultSemester: state.schedule.defaultSemester,
    semesters: state.schedule.semesters,
});

const mapDispatchToProps = (dispatch) => ({
    getDefaultSemester: () => dispatch(getDefaultSemesterRequsted()),
    setSemesterId: (id) => dispatch(setScheduleSemesterId(id)),
    setTypeOfSchedule: (type) => dispatch(setScheduleType(type)),
    setGroupId: (id) => dispatch(setScheduleGroupId(id)),
    setTeacherId: (id) => dispatch(setScheduleTeacherId(id)),
    getGroupSchedule: (groupId, semesterId) => dispatch(getGroupScheduleStart(groupId, semesterId)),
    getTeacherSchedule: (groupId, semesterId) =>
        dispatch(getTeacherScheduleStart(groupId, semesterId)),
    getFullSchedule: (semesterId) => dispatch(getFullScheduleStart(semesterId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSchedulePage);
