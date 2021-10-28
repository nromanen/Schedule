import { connect } from 'react-redux';
import { selectGroupId } from '../../actions';
import Search from '../../components/LessonsPage/Search/Search';

const mapStateToProps = (state) => ({
    groupId: state.lesson.groupId,
    groups: state.groups.groups,
});

const mapDispatchToProps = (dispatch) => ({
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
