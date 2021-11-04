import { connect } from 'react-redux';
import SemesterPage from '../../components/Semester/SemesterPage/SemesterPage';
import {
    getAllSemestersStart,
    getDisabledSemestersStart,
    getArchivedSemestersStart,
    handleSemesterStart,
    setError,
} from '../../actions/semesters';
import { fetchEnabledGroupsStart } from '../../actions/groups';
import { setOpenErrorSnackbar } from '../../actions/snackbar';

const mapStateToProps = (state) => ({
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
    handleSemester: (values) => dispatch(handleSemesterStart(values)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    setError: (res) => dispatch(setError(res)),
    getAllGroupsItems: () => dispatch(fetchEnabledGroupsStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPage);
