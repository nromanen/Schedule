import '../../components/LessonsPageComponent/LessonPage.scss';
import { connect } from 'react-redux';
import LessonPage from '../../components/LessonsPageComponent/LessonPage';

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

// export default connect(mapStateToProps)(LessonPage);
export default LessonPage;
