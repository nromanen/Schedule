import { connect } from 'react-redux';
import SemesterItem from '../../components/Semester/SemesterItem';

const mapStateToProps = (state) => ({
    enabledSemesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
});

export default connect(mapStateToProps)(SemesterItem);
