import React from 'react';
import { authTypes } from '../../constants/auth';
import '../Auth/Auth.scss';
import AuthContainer from '../../containers/AuthContainer/AuthContainer';

const Register = () => {
    return <AuthContainer authType={authTypes.REGISTRATION} />;
};
export { Register };
