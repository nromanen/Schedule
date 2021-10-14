import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { links } from '../../constants/links';
import { authTypes } from '../../constants/auth';
import { userRoles } from '../../constants/userRoles';
import { snackbarTypes } from '../../constants/snackbarTypes';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import { validation } from '../../constants/validation';
import { resetFormHandler } from '../../helper/formHelper';
import { handleSnackbarOpenService } from '../../services/snackbarService';
import { LOGIN_FORM, REGISTRATION_FORM, RESET_PASSWORD_FORM } from '../../constants/reduxForms';
import {
    authUser,
    registerUser,
    resetUserPassword,
    setAuthError,
    setLoading,
} from '../../actions/index';

import './Auth.scss';

const Auth = (props) => {
    const { t } = useTranslation('common');
    const [authType, setAuthType] = useState(authTypes.LOGIN);

    const url = window.document.location;
    const parser = new URL(url);

    let isSuccess;
    let message;
    const { error, isLoading } = props;

    const socialLoginHandler = (data) => {
        props.setLoading(true);
        if (!data.token || data.token.length < 20) {
            props.setError({ login: t('broken_token') });
            return;
        }
        setAuthType(authTypes.GOOGLE);
        props.onAuth(data);
        resetFormHandler(LOGIN_FORM);
        window.history.replaceState({}, document.title, '/');
        props.setLoading(false);
    };

    let social = false;
    let isToken = false;
    let splitedParamToken = '';

    if (parser.search.length > 0) {
        const params = parser.search.split('&');
        if (params) {
            params.forEach((param) => {
                const splitedParam = param.split('=');
                if (splitedParam) {
                    if (splitedParam[0] === '?social' && splitedParam[1] === 'true') {
                        social = true;
                    }
                    if (splitedParam[0] === 'token' && splitedParam[1].length > 0) {
                        isToken = true;
                        splitedParamToken = splitedParam;
                    }
                }
            });
        }
        if (social && isToken)
            socialLoginHandler({ authType: 'google', token: splitedParamToken[1] });
    }

    useEffect(() => {
        if (
            authType === authTypes.REGISTRATION &&
            props.response &&
            get(props.resetPasswordResponse.data, 'message')
        ) {
            setAuthType(authTypes.LOGIN);
            message = t('successful_registered_message');
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
        }
    }, [props.response]);

    useEffect(() => {
        if (props.resetPasswordResponse && get(props.resetPasswordResponse.data, 'message')) {
            setAuthType(authTypes.LOGIN);
            message = t('successful_reset_password_message');
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
        }
    }, [props.resetPasswordResponse]);

    const loginHandler = (loginData) => {
        if (!loginData.email || !loginData.password) {
            props.setError({ login: t('empty_fields') });
            return;
        }
        if (!validation.EMAIL.test(loginData.email)) {
            props.setError({ login: t('validationMessages:email') });
            return;
        }
        props.onAuth(loginData);
        props.setLoading(true);
        resetFormHandler(LOGIN_FORM);
    };

    const registrationHandler = (registrationData) => {
        if (registrationData.password !== registrationData.retypePassword) {
            props.setError({
                registration: { passwords: t('different_passwords') },
            });
            return;
        }
        props.onRegister({
            email: registrationData.email,
            password: registrationData.password,
        });
        props.setLoading(true);
        resetFormHandler(REGISTRATION_FORM);
    };

    const resetPasswordHandler = (resetPasswordData) => {
        props.onResetPassword({
            email: resetPasswordData.email,
        });
        props.setLoading(true);
        resetFormHandler(RESET_PASSWORD_FORM);
    };

    if (!error && props.userRole) {
        isSuccess = !!props.token;
        message = t('successful_login_message');
        handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
    }

    const commonCondition = !error && isSuccess && !isLoading;
    // switch case
    let authRedirect = null;
    if (commonCondition && props.userRole === userRoles.MANAGER) {
        authRedirect = <Redirect to={links.ADMIN_PAGE} />;
    } else if (commonCondition && props.userRole) {
        authRedirect = <Redirect to={links.HOME_PAGE} />;
    } else if (commonCondition && props.userRole === userRoles.TEACHER) {
        authRedirect = <Redirect to={links.HOME_PAGE} />;
    }

    const switchAuthModeHandler = (newAuthType) => {
        setAuthType(newAuthType);
    };

    let authPage;

    switch (authType) {
        case authTypes.REGISTRATION:
            document.title = t('registration_page_title');
            authPage = (
                <RegistrationForm
                    isLoading={isLoading}
                    registrationError={error}
                    onSubmit={registrationHandler}
                    switchAuthMode={switchAuthModeHandler}
                    translation={t}
                    setError={props.setError}
                />
            );
            break;
        case authTypes.RESET_PASSWORD:
            document.title = t('reset_password_page_title');
            authPage = (
                <ResetPasswordForm
                    isLoading={isLoading}
                    resetPasswordError={error}
                    onSubmit={resetPasswordHandler}
                    switchAuthMode={switchAuthModeHandler}
                    translation={t}
                    setError={props.setError}
                />
            );
            break;
        default:
            document.title = t('login_page_title');
            authPage = (
                <LoginForm
                    isLoading={isLoading}
                    loginError={error}
                    onSubmit={loginHandler}
                    switchAuthMode={switchAuthModeHandler}
                    translation={t}
                    setError={props.setError}
                />
            );
    }

    return (
        <div className="auth-form">
            {authRedirect}
            {authPage}
        </div>
    );
};

const mapStateToProps = (state) => ({
    response: state.auth.response,
    resetPasswordResponse: state.auth.resetPasswordResponse,
    error: state.auth.error,
    token: state.auth.token,
    userRole: state.auth.role,
    loading: state.loadingIndicator.loading,
});

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (data) => dispatch(authUser(data)),
        onRegister: (data) => dispatch(registerUser(data)),
        onResetPassword: (data) => dispatch(resetUserPassword(data)),
        setLoading: (isLoading) => dispatch(setLoading(isLoading)),
        setError: (error) => dispatch(setAuthError(error)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
