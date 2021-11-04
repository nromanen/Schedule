import { connect } from 'react-redux';
import SemesterPage from '../../components/Semester/SemesterPage/SemesterPage';
import {
    getAllSemestersStart,
    getDisabledSemestersStart,
    getArchivedSemestersStart,
    setGroupsToSemesterStart,
    handleSemesterStart,
    setError,
} from '../../actions/semesters';
import { fetchEnabledGroupsStart } from '../../actions/groups';
import { setOpenErrorSnackbar, setOpenSuccessSnackbar } from '../../actions/snackbar';

const mapStateToProps = (state) => ({
    semesters: state.semesters.semesters,
    archivedSemesters: state.semesters.archivedSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    semester: state.semesters.semester,
    groups: state.groups.groups,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
    getDisabledSemestersItems: () => dispatch(getDisabledSemestersStart()),
    getArchivedSemestersItems: () => dispatch(getArchivedSemestersStart()),
    setGroupsToSemester: (semesterId, groups) =>
        dispatch(setGroupsToSemesterStart(semesterId, groups)),
    handleSemester: (values) => dispatch(handleSemesterStart(values)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setError: (res) => dispatch(setError(res)),
    getAllGroupsItems: () => dispatch(fetchEnabledGroupsStart()),
    setOpenSuccessSnackbar: (message) => dispatch(setOpenSuccessSnackbar(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPage);
