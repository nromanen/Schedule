import { connect } from 'react-redux';
import { addItemsToScheduleStart, editRoomItemToScheduleStart } from '../../actions/schedule';
import { getLessonsByGroup, selectGroupId } from '../../actions';
import Schedule from '../../components/EditCurrentSchedule/Schedule/Schedule';

const mapDispatchToProps = (dispatch) => ({
    addItemsToSchedule: (item) => dispatch(addItemsToScheduleStart(item)),
    editRoomItemToSchedule: (item) => dispatch(editRoomItemToScheduleStart(item)),
    selectedGroupById: (id) => dispatch(selectGroupId(id)),
    getLessonsByGroupId: (id) => dispatch(getLessonsByGroup(id)),
});

export default connect(null, mapDispatchToProps)(Schedule);
