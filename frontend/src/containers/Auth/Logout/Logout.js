import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../../redux/actions/index';

const Logout = (props) => {
    useEffect(() => {
        props.onLogout();
    }, []);
    // useEffect(()=>setScheduleSemesterIdService(0))
    // const history=useHistory();
    // useEffect(()=>history.push("/"));
    return <Redirect to="/" />;
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => dispatch(logout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
