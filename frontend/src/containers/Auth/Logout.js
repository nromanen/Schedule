import {connect} from 'react-redux';
import {logout} from '../../actions/index';
import Logout from '../../components/Auth/Logout';
import { initiateLogout } from '../../actions/index';

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => dispatch(initiateLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
