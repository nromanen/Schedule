import { connect } from 'react-redux';
import ScheduleDialog from '../../components/ScheduleDialog/ScheduleDialog';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
export default connect(mapStateToProps, {})(ScheduleDialog);
