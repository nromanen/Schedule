import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import ScheduleDialog from '../../components/ScheduleDialog/ScheduleDialog';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDialog);
