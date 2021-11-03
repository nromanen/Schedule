import { connect } from 'react-redux';
import '../../components/LessonsPage/LessonPage.scss';
import LessonPage from '../../components/LessonsPage/LessonPage';
import {
    copyLessonCard,
    createLessonCardStart,
    deleteLessonCardStart,
    getLessonsByGroup,
    getLessonTypes,
    selectLessonCard,
    setUniqueError,
    setIsOpenConfirmDialog,
    updateLessonCardStart,
    fetchEnabledGroupsStart,
} from '../../actions';
import { setOpenErrorSnackbar } from '../../actions/snackbar';

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
    fetchEnabledGroupsStart: () => dispatch(fetchEnabledGroupsStart()),
    getLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getLessonTypes: () => dispatch(getLessonTypes()),
    updateLessonCardStart: ({ info, groupId }) =>
        dispatch(updateLessonCardStart({ info, groupId })),
    createLessonCardStart: ({ info, isCopy }) => dispatch(createLessonCardStart({ info, isCopy })),
    deleteLessonCardStart: (lessonId) => dispatch(deleteLessonCardStart(lessonId)),
    copyLessonCard: (group, lesson) => dispatch(copyLessonCard(group, lesson)),
    selectLessonCard: (lessonCardId) => dispatch(selectLessonCard(lessonCardId)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setUniqueError: (value) => dispatch(setUniqueError(value)),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPage);
