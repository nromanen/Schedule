import { connect } from 'react-redux';
import SemesterList from '../../components/Semester/SemesterList';
import {
    createArchivedSemesterStart,
    getArchivedSemesterStart,
    selectSemester,
    updateSemesterStart,
    deleteSemesterStart,
    updateSemesterByIdStart,
    setSemesterCopyStart,
    setGroupsToSemesterStart,
} from '../../actions/semesters';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import { setOpenSuccessSnackbar } from '../../actions/snackbar';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
    semesters: state.semesters.semesters,
});

const mapDispatchToProps = (dispatch) => ({
    createArchivedSemester: (semesterId) => dispatch(createArchivedSemesterStart(semesterId)),
    getArchivedSemester: (semesterId) => dispatch(getArchivedSemesterStart(semesterId)),
    selectSemester: (semesterId) => dispatch(selectSemester(semesterId)),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    updateSemester: (item) => dispatch(updateSemesterStart(item)),
    removeSemesterCard: (semesterId) => dispatch(deleteSemesterStart(semesterId)),
    setDefaultSemesterById: (semesterId, isDisabled) =>
        dispatch(updateSemesterByIdStart(semesterId, isDisabled)),
    semesterCopy: (values) => dispatch(setSemesterCopyStart(values)),
    setOpenSuccessSnackbar: (message) => dispatch(setOpenSuccessSnackbar(message)),
    setGroupsToSemester: (semesterId, groups) =>
        dispatch(setGroupsToSemesterStart(semesterId, groups)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterList);
