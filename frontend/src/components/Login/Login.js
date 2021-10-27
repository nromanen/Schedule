import React from 'react';
import { authTypes } from '../../constants/auth';
import '../Auth/Auth.scss';
import AuthContainer from '../../containers/AuthContainer/AuthContainer';

const Login = () => {
    return <AuthContainer authType={authTypes.LOGIN} />;
};
export { Login };
