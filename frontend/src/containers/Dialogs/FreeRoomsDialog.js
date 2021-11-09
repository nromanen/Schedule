import { connect } from 'react-redux';
import { getFreeRoomsStart } from '../../actions/rooms';
import FreeRooms from '../../components/FreeRoomsDialog/FreeRoomsDialog';

const mapStateToProps = (state) => ({
    freeRooms: state.rooms.freeRooms,
});
const mapDispatchToProps = (dispatch) => ({
    getFreeRoomsByParams: (params) => dispatch(getFreeRoomsStart(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FreeRooms);
