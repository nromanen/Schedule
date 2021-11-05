import { connect } from 'react-redux';
import { getAllScheduleItemsStart } from '../../actions/schedule';
import BusyRoomPage from '../../components/BusyRoomsPage/BusyRoomsPage';

const mapStateToProps = (state) => ({
    busyRooms: state.busyRooms.busyRooms,
    loading: state.loadingIndicator.loading,
    currentSemester: state.schedule.currentSemester,
    roomTypes: state.roomTypes.roomTypes,
});

const mapDispatchToProps = (dispatch) => ({
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusyRoomPage);
