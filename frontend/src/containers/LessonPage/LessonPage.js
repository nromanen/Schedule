import { connect } from 'react-redux';
import '../../components/LessonsPage/LessonPage.scss';
import LessonPage from '../../components/LessonsPage/LessonPage';
import {
    copyLessonCard,
    deleteLessonCardStart,
    getLessonsByGroup,
    getLessonTypes,
    selectLessonCard,
    setUniqueError,
    setIsOpenConfirmDialog,
    selectGroupId,
} from '../../actions';
import { setOpenErrorSnackbar } from '../../actions/snackbar';
import { copyLessonsFromSemesterStart } from '../../actions/semesters';
import { handleLessonStart } from '../../actions/lesson';
import { showAllTeachersStart } from '../../actions/teachers';

const mapStateToProps = (state) => ({
    lessons: state.lesson.lessons,
    lessonTypes: state.lesson.lessonTypes,
    groupId: state.lesson.groupId,
    isUniqueError: state.lesson.uniqueError,
    teachers: state.teachers.teachers,
    groups: state.groups.groups,
    group: state.groups.group,
    subjects: state.subjects.subjects,
    loading: state.loadingIndicator.loading,
    semesters: state.semesters.semesters,
    currentSemester: state.schedule.currentSemester,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    getLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getLessonTypes: () => dispatch(getLessonTypes()),
    deleteLessonCardStart: (lessonId) => dispatch(deleteLessonCardStart(lessonId)),
    copyLessonCard: (group, lesson) => dispatch(copyLessonCard(group, lesson)),
    selectLessonCard: (lessonCardId) => dispatch(selectLessonCard(lessonCardId)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setUniqueError: (value) => dispatch(setUniqueError(value)),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    copyLessonsFromSemester: (values) => dispatch(copyLessonsFromSemesterStart(values)),
    handleLesson: (values, groupId) => dispatch(handleLessonStart(values, groupId)),
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
    showAllTeachers: () => dispatch(showAllTeachersStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPage);
