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
} from '../../actions/semesters';
import { setIsOpenConfirmDialog } from '../../actions/dialog';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SemesterList);
