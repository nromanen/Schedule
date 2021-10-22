import React from 'react';
import { authTypes } from '../../constants/auth';
import '../Auth/Auth.scss';
import AuthContainer from '../../containers/AuthContainer/AuthContainer';

const ResetPassword = () => {
    return <AuthContainer authType={authTypes.RESET_PASSWORD} />;
};
export { ResetPassword };
