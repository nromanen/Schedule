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
    handleSemesterStart,
    setError,
} from '../../actions/semesters';
import { fetchEnabledGroupsStart } from '../../actions/groups';
import { setOpenErrorSnackbar } from '../../actions/snackbar';
import { setIsOpenConfirmDialog } from '../../actions/dialog';

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
    removeSemesterCard: (semesterId) => dispatch(deleteSemesterStart(semesterId)),
    setDefaultSemesterById: (semesterId, isDisabled) =>
        dispatch(updateSemesterByIdStart(semesterId, isDisabled)),
    updateSemester: (item) => dispatch(updateSemesterStart(item)),
    semesterCopy: (values) => dispatch(setSemesterCopyStart(values)),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    handleSemester: (values) => dispatch(handleSemesterStart(values)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setError: (res) => dispatch(setError(res)),
    getAllGroupsItems: () => dispatch(fetchEnabledGroupsStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPage);
