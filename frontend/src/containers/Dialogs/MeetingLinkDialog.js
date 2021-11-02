import { connect } from 'react-redux';
import { LinkToMeeting } from '../../components/LinkToMeeting/LinkToMeeting';
import { setIsOpenConfirmDialog } from '../../actions/dialog';

const mapStateToProps = (state) => ({
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LinkToMeeting);
