import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions';
import { StudentsPage } from '../../components/Students/StudentsPage';
import {
    deleteStudentStart,
    selectStudentSuccess,
    moveStudentsToGroupStart,
    setExistingGroupStudentStart,
} from '../../actions/students';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = {
    deleteStudentStart,
    selectStudentSuccess,
    setIsOpenConfirmDialog,
    moveStudentsToGroupStart,
    setExistingGroupStudentStart,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
