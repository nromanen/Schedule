import {connect} from 'react-redux';
import {setIsOpenConfirmDialog} from '../../actions';
import {StudentsPage} from '../../components/Students/StudentsPage';
import {
    checkAllStudentsSuccess,
    deleteStudentStart,
    moveStudentsToGroupStart,
    selectStudentSuccess,
    updateStudentSuccess,
} from '../../actions/students';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = {
    deleteStudentStart,
    updateStudentSuccess,
    selectStudentSuccess,
    setIsOpenConfirmDialog,
    checkAllStudentsSuccess,
    moveStudentsToGroupStart,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
