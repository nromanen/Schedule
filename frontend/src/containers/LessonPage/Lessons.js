import { connect } from 'react-redux';
import { selectLessonCard } from '../../actions';
import Lessons from '../../components/LessonsPage/Lessons';

const mapStateToProps = (state) => ({
    groupId: state.lesson.groupId,
    loading: state.loadingIndicator.loading,
    group: state.groups.group,
});

const mapDispatchToProps = (dispatch) => ({
    selectLessonCardOf: (lessonCardId) => dispatch(selectLessonCard(lessonCardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
