import { connect } from 'react-redux';
import SemesterItem from '../../components/Semester/SemesterItem';
import { createArchivedSemesterStart, getArchivedSemesterStart } from '../../actions/semesters';

const mapStateToProps = (state) => ({
    enabledSemesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
});
const mapDispatchToProps = (dispatch) => ({
    createArchivedSemester: (semesterId) => dispatch(createArchivedSemesterStart(semesterId)),
    getArchivedSemester: (semesterId) => dispatch(getArchivedSemesterStart(semesterId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterItem);
