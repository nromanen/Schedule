import { connect } from 'react-redux';
import SemesterPage from '../../components/Semester/SemesterPage/SemesterPage';
import {
    getAllSemestersStart,
    getDisabledSemestersStart,
    getArchivedSemestersStart,
    setGroupsToSemesterStart,
    deleteSemesterStart,
    updateSemesterByIdStart,
    updateSemesterStart,
    setSemesterCopyStart,
} from '../../actions/semesters';

const mapStateToProps = (state) => ({
    enabledSemesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    semester: state.semesters.semester,
    groups: state.groups.groups,
});
const mapDispatchToProps = (dispatch) => ({
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
    getDisabledSemestersItems: () => dispatch(getDisabledSemestersStart()),
    getArchivedSemestersItems: () => dispatch(getArchivedSemestersStart()),
    setGroupsToSemester: (semesterId, groups) =>
        dispatch(setGroupsToSemesterStart(semesterId, groups)),
    removeSemesterCard: (semesterId) => dispatch(deleteSemesterStart(semesterId)),
    setDefaultSemesterById: (semesterId) => dispatch(updateSemesterByIdStart(semesterId)),
    updateSemester: (item) => dispatch(updateSemesterStart(item)),
    semesterCopy: (values) => dispatch(setSemesterCopyStart(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPage);
