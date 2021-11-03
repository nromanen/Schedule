import { connect } from 'react-redux';
import { selectGroupId, selectGroupSuccess } from '../../actions';
import Search from '../../components/LessonsPage/Search/Search';

const mapStateToProps = (state) => ({
    groupId: state.lesson.groupId,
    groups: state.groups.groups,
});

const mapDispatchToProps = (dispatch) => ({
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
    selectGroupSuccess: (id) => dispatch(selectGroupSuccess(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
