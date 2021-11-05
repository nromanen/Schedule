import { connect } from 'react-redux';
import SemesterPage from '../../components/Semester/SemesterPage';
import {
    getAllSemestersStart,
    getDisabledSemestersStart,
    getArchivedSemestersStart,
    handleSemesterStart,
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
    classScheduler: state.classActions.classScheduler,
});
const mapDispatchToProps = (dispatch) => ({
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
    getDisabledSemestersItems: () => dispatch(getDisabledSemestersStart()),
    getArchivedSemestersItems: () => dispatch(getArchivedSemestersStart()),
    handleSemester: (values) => dispatch(handleSemesterStart(values)),
    setOpenErrorSnackbar: (message) => dispatch(setOpenErrorSnackbar(message)),
    getAllGroupsItems: () => dispatch(fetchEnabledGroupsStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPage);
