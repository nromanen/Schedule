import { connect } from 'react-redux';
import '../../components/LessonsPage/LessonPage.scss';
import LessonPage from '../../components/LessonsPage/LessonPage';
import {
    copyLessonCard,
    createLessonStart,
    deleteLessonCardStart,
    getLessonsByGroup,
    getLessonTypes,
    selectLessonCard,
    setUniqueError,
    setIsOpenConfirmDialog,
    updateLessonCardStart,
} from '../../actions';
import { setOpenErrorSnackbar } from '../../actions/snackbar';
import { copyLessonsFromSemesterStart } from '../../actions/semesters';
import { handleLessonStart } from '../../actions/lesson';

const mapStateToProps = (state) => ({
    lessons: state.lesson.lessons,
    lessonTypes: state.lesson.lessonTypes,
    groupId: state.lesson.groupId,
    isUniqueError: state.lesson.uniqueError,
    teachers: state.teachers.teachers,
    groups: state.groups.groups,
    subjects: state.subjects.subjects,
    loading: state.loadingIndicator.loading,
    semesters: state.semesters.semesters,
    currentSemester: state.schedule.currentSemester,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    getLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getLessonTypes: () => dispatch(getLessonTypes()),
    updateLessonCardStart: ({ info, groupId }) =>
        dispatch(updateLessonCardStart({ info, groupId })),
    createLessonStart: ({ info, isCopy }) => dispatch(createLessonStart({ info, isCopy })),
    deleteLessonCardStart: (lessonId) => dispatch(deleteLessonCardStart(lessonId)),
    copyLessonCard: (group, lesson) => dispatch(copyLessonCard(group, lesson)),
    selectLessonCard: (lessonCardId) => dispatch(selectLessonCard(lessonCardId)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setUniqueError: (value) => dispatch(setUniqueError(value)),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    copyLessonsFromSemester: ({ values, toSemesterId, fromSemesterId }) =>
        dispatch(copyLessonsFromSemesterStart({ ...values, toSemesterId, fromSemesterId })),
    handleLesson: (values, currentSemester) => dispatch(handleLessonStart(values, currentSemester)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPage);
