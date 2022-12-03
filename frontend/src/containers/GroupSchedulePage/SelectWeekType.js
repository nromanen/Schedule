import {connect} from 'react-redux';
import {setWeekType} from '../../actions/schedule';
import SelectWeekType from "../../components/GroupSchedulePage/SelectWeekType";

const mapStateToProps = (state) => ({
    week_type: state.schedule.week_type,
});

const mapDispatchToProps = (dispatch) => ({
    setWeekType: (week_type) => dispatch(setWeekType(week_type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectWeekType);
