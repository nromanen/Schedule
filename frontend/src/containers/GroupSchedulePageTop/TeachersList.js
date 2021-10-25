import { connect } from 'react-redux';
import TeachersList from '../../components/GroupSchedulePageTop/TeachersList';

const mapStateToProps = (state) => ({
    teachers: state.teachers.teachers,
});

export default connect(mapStateToProps)(TeachersList);
