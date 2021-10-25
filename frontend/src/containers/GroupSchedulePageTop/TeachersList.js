import { connect } from 'react-redux';
import TeachersList from '../../components/GroupSchedulePageTop/TeachersList';

const mapStateToProps = (state) => {
    return {
        teachers: state.teachers.teachers,
    };
};

export default connect(mapStateToProps)(TeachersList);
