import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../../../redux/actions/index';
import { setScheduleSemesterIdService } from '../../../services/scheduleService';

const Logout = props => {
    useEffect(() => {
        props.onLogout();
    }, []);
    useEffect(()=>setScheduleSemesterIdService(0))
    return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(logout())
    };
};

export default connect(null, mapDispatchToProps)(Logout);
