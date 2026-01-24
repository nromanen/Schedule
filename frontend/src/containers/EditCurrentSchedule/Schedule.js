import {connect} from 'react-redux';
import {addItemsToScheduleStart, editRoomItemToScheduleStart} from '../../actions/schedule';
import {getLessonsByGroupStart, selectGroupId, setScheduleLoading} from '../../actions';
import Schedule from '../../components/EditCurrentSchedule/Schedule/Schedule';
import {setScheduleOperationLoading} from "../../actions/loadingIndicator";

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    scheduleOperationLoading: state.loadingIndicator.scheduleOperationLoading,
});

const mapDispatchToProps = (dispatch) => ({
    addItemsToSchedule: (item) => dispatch(addItemsToScheduleStart(item)),
    editRoomItemToSchedule: (item) => dispatch(editRoomItemToScheduleStart(item)),
    selectedGroupById: (id) => dispatch(selectGroupId(id)),
    getLessonsByGroupId: (id) => dispatch(getLessonsByGroupStart(id)),
    setScheduleLoading: (newState) => dispatch(setScheduleLoading(newState)),
    setScheduleOperationLoading: (loading) => dispatch(setScheduleOperationLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);