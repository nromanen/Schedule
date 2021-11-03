import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions';
import { StudentsPage } from '../../components/Students/StudentsPage';
import { deleteStudentStart, selectStudentSuccess } from '../../actions/students';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = { setIsOpenConfirmDialog, deleteStudentStart, selectStudentSuccess };

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
