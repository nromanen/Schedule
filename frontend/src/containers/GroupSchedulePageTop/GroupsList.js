import { connect } from 'react-redux';
import GroupsList from '../../components/GroupSchedulePageTop/GroupsList';

const mapStateToProps = (state) => {
    return {
        groups: state.groups.groups,
    };
};

export default connect(mapStateToProps)(GroupsList);
