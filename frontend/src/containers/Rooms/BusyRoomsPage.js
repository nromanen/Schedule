import {connect} from 'react-redux';
import {getAllScheduleItemsStart} from '../../actions/schedule';
import BusyRoomPage from '../../components/BusyRoomsPage/BusyRoomsPage';
import {getCombinedBusyRoomsStart} from '../../actions/rooms';
import {getClassScheduleListStart} from '../../actions/classes';
import {setScheduleLoading} from '../../actions';

const mapStateToProps = (state) => ({
    semesterId: state.schedule.currentSemester.id,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    currentSemester: state.schedule.currentSemester,
    combinedBusyRooms: state.rooms.combinedBusyRooms,
});

const mapDispatchToProps = (dispatch) => ({
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    setScheduleLoading: (newState) => dispatch(setScheduleLoading(newState)),
    getCombinedBusyRooms: () => dispatch(getCombinedBusyRoomsStart()),
    getClassScheduleList: () => dispatch(getClassScheduleListStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusyRoomPage);
