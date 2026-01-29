import {connect} from 'react-redux';
import {
    getDefaultSemesterRequsted,
    selectFullSchedule,
    selectGroupSchedule,
    selectTeacherSchedule,
    selectDepartmentSchedule,
} from '../../actions/schedule';
import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

const mapStateToProps = (state) => ({
    defaultSemester: state.schedule.defaultSemester,
    scheduleType: state.schedule.scheduleType,
    loading: state.loadingIndicator.mainScheduleLoading,
    groupSchedule: state.schedule.groupSchedule,
    fullSchedule: state.schedule.fullSchedule,
    teacherSchedule: state.schedule.teacherSchedule,
    groupData: state.schedule.scheduleGroup,
    teacherData: state.schedule.scheduleTeacher,
    departmentData: state.schedule.scheduleDepartment,
    semesterData: state.schedule.scheduleSemester,
    semesters: state.schedule.semesters,
    notPublished: state.schedule.notPublished,
    notPublishedMessage: state.schedule.notPublishedMessage,
    isManager: state.auth.role === 'ROLE_MANAGER' || state.auth.role === 'ROLE_ADMIN',
});

const mapDispatchToProps = (dispatch) => ({
    getDefaultSemester: () => dispatch(getDefaultSemesterRequsted()),
    getGroupSchedule: (semester, group) => dispatch(selectGroupSchedule(semester, group)),
    getTeacherSchedule: (semester, teacher) => dispatch(selectTeacherSchedule(semester, teacher)),
    getFullSchedule: (semester) => dispatch(selectFullSchedule(semester)),
    getDepartmentSchedule: (semester, department) => dispatch(selectDepartmentSchedule(semester, department)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSchedulePage);