import { connect } from 'react-redux';
import { toggleDisabled, setSearchName } from '../../actions/sidebar';
import { Sidebar } from '../../share/Sidebar/Sidebar';

const mapStateToProps = (state) => ({
    isDisabled: state.sidebar.isDisabled,
    searchName: state.sidebar.searchName,
});

const mapDispatchToProps = {
    toggleDisabled,
    setSearchName,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
