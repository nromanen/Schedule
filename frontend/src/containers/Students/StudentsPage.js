import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions';
import { StudentsPage } from '../../components/Students/StudentsPage';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = { setIsOpenConfirmDialog };

export default connect(mapStateToProps, mapDispatchToProps)(StudentsPage);
