import { connect } from 'react-redux';
import { toggleDisabled, setSearchDisabled } from '../../actions/sidebar';
import Sidebar from '../../components/Sidebar/Sidebar';

const mapStateToProps = (state) => ({
    isDisabled: state.sidebar.isDisabled,
    searchName: state.sidebar.searchName,
});

const mapDispatchToProps = {
    toggleDisabled,
    setSearchDisabled,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
