import { connect } from 'react-redux';
import SemesterList from '../../components/Semester/SemesterList';
import {
    createArchivedSemesterStart,
    getArchivedSemesterStart,
    selectSemester,
} from '../../actions/semesters';

const mapDispatchToProps = (dispatch) => ({
    createArchivedSemester: (semesterId) => dispatch(createArchivedSemesterStart(semesterId)),
    getArchivedSemester: (semesterId) => dispatch(getArchivedSemesterStart(semesterId)),
    selectSemester: (semesterId) => dispatch(selectSemester(semesterId)),
});

export default connect(null, mapDispatchToProps)(SemesterList);
