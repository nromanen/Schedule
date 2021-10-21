import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ADMIN_PAGE_LINK, HOME_PAGE_LINK } from '../../constants/links';
import { authTypes } from '../../constants/auth';
import { userRoles } from '../../constants/userRoles';
import { snackbarTypes } from '../../constants/snackbarTypes';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm';
import { GOOGLE } from '../../constants/common';

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
import { EMAIL_MESSAGE } from '../../constants/translationLabels/validationMessages';
import {
    DIFFERENT_PASSWORDS,
    BROKEN_TOKEN,
    LOGIN_TITLE,
    REGISTRATION_PAGE_TITLE,
    RESET_PASSWORD_PAGE_TITLE,
    SUCCESSFUL_LOGIN_MESSAGE,
    SUCCESSFUL_REGISTERED_MESSAGE,
    SUCCESSFUL_RESET_PASSWORD_MESSAGE,
    EMPTY_FIELDS,
} from '../../constants/translationLabels/common';

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
            props.setError({ login: t(BROKEN_TOKEN) });
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
            socialLoginHandler({ authType: GOOGLE, token: splitedParamToken[1] });
    }

    useEffect(() => {
        if (
            authType === authTypes.REGISTRATION &&
            props.response &&
            get(props.resetPasswordResponse.data, 'message')
        ) {
            setAuthType(authTypes.LOGIN);
            message = t(SUCCESSFUL_REGISTERED_MESSAGE);
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
        }
    }, [props.response]);

    useEffect(() => {
        if (props.resetPasswordResponse && get(props.resetPasswordResponse.data, 'message')) {
            setAuthType(authTypes.LOGIN);
            message = t(SUCCESSFUL_RESET_PASSWORD_MESSAGE);
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
        }
    }, [props.resetPasswordResponse]);

    const loginHandler = (loginData) => {
        if (!loginData.email || !loginData.password) {
            props.setError({ login: t(EMPTY_FIELDS) });
            return;
        }
        if (!validation.EMAIL.test(loginData.email)) {
            props.setError({ login: t(EMAIL_MESSAGE) });
            return;
        }
        props.onAuth(loginData);
        props.setLoading(true);
        resetFormHandler(LOGIN_FORM);
    };

    const registrationHandler = (registrationData) => {
        if (registrationData.password !== registrationData.retypePassword) {
            props.setError({
                registration: { passwords: t(DIFFERENT_PASSWORDS) },
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
        message = t(SUCCESSFUL_LOGIN_MESSAGE);
        handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
    }

    const commonCondition = !error && isSuccess && !isLoading;
    // switch case
    let authRedirect = null;
    if (commonCondition && props.userRole === userRoles.MANAGER) {
        authRedirect = <Redirect to={ADMIN_PAGE_LINK} />;
    } else if (commonCondition && props.userRole) {
        authRedirect = <Redirect to={HOME_PAGE_LINK} />;
    } else if (commonCondition && props.userRole === userRoles.TEACHER) {
        authRedirect = <Redirect to={HOME_PAGE_LINK} />;
    }

    const switchAuthModeHandler = (newAuthType) => {
        setAuthType(newAuthType);
    };

    let authPage;

    switch (authType) {
        case authTypes.REGISTRATION:
            document.title = t(REGISTRATION_PAGE_TITLE);
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
            document.title = t(RESET_PASSWORD_PAGE_TITLE);
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
            document.title = t(LOGIN_TITLE);
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
