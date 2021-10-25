import { connect } from 'react-redux';
import SemestersList from '../../components/GroupSchedulePageTop/SemestersList';

const mapStateToProps = (state) => {
    return {
        semesters: state.schedule.semesters,
        initialValues: {
            semester: state.schedule.scheduleSemesterId,
        },
    };
};

export default connect(mapStateToProps)(SemestersList);
