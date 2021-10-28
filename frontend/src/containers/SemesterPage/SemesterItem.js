import { connect } from 'react-redux';
import SemesterItem from '../../components/Semester/SemesterItem';
import { createArchivedSemesterStart, getArchivedSemesterStart } from '../../actions/semesters';

const mapDispatchToProps = (dispatch) => ({
    createArchivedSemester: (semesterId) => dispatch(createArchivedSemesterStart(semesterId)),
    getArchivedSemester: (semesterId) => dispatch(getArchivedSemesterStart(semesterId)),
});

export default connect(null, mapDispatchToProps)(SemesterItem);
