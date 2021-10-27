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
    updateLessonCardStart,
} from '../../actions';

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
});

const mapDispatchToProps = (dispatch) => ({
    getLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getLessonTypes: () => dispatch(getLessonTypes()),
    updateLessonCardStart: ({ info, groupId }) =>
        dispatch(updateLessonCardStart({ info, groupId })),
    createLessonCardStart: ({ info, isCopy }) => dispatch(createLessonCardStart({ info, isCopy })),
    deleteLessonCardStart: (lessonId) => dispatch(deleteLessonCardStart(lessonId)),
    copyLessonCard: (group, lesson) => dispatch(copyLessonCard(group, lesson)),
    selectLessonCard: (lessonCardId) => dispatch(selectLessonCard(lessonCardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPage);
