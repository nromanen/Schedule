import { connect } from 'react-redux';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import ScheduleDialog from '../../components/ScheduleDialog/ScheduleDialog';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
    availability: state.schedule.availability,
    rooms: state.rooms.rooms,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDialog);
