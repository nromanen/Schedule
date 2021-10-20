import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { get, isEmpty } from 'lodash';
import { Redirect, useHistory } from 'react-router-dom';
import { links } from '../../constants/links';
import { authTypes } from '../../constants/auth';
import { userRoles } from '../../constants/userRoles';
import { snackbarTypes } from '../../constants/snackbarTypes';
import LoginForm from '../LoginForm/LoginForm';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import { GOOGLE } from '../../constants/common';

import { resetFormHandler } from '../../helper/formHelper';
import { handleSnackbarOpenService } from '../../services/snackbarService';
import { LOGIN_FORM, REGISTRATION_FORM, RESET_PASSWORD_FORM } from '../../constants/reduxForms';

import './Auth.scss';
import {
    BROKEN_TOKEN,
    LOGIN_TITLE,
    REGISTRATION_PAGE_TITLE,
    RESET_PASSWORD_PAGE_TITLE,
    SUCCESSFUL_LOGIN_MESSAGE,
    SUCCESSFUL_REGISTERED_MESSAGE,
    SUCCESSFUL_RESET_PASSWORD_MESSAGE,
} from '../../constants/translationLabels/common';

const Auth = (props) => {
    const {
        type,
        userRole,
        token,
        response,
        resetPasswordResponse,
        onRegister,
        onResetPassword,
        setLoadingForm,
        onAuth,
        setError,
        error,
        isLoading,
    } = props;
    const { t } = useTranslation('common');
    const [authType, setAuthType] = useState(type);
    const history = useHistory();
    const url = window.document.location;
    const parser = new URL(url);

    const loginHandler = (loginData) => {
        onAuth(loginData);
        setLoadingForm(true);
        resetFormHandler(LOGIN_FORM);
    };

    const registrationHandler = (registrationData) => {
        onRegister({
            email: registrationData.email,
            password: registrationData.password,
        });
        setLoadingForm(true);
        resetFormHandler(REGISTRATION_FORM);
    };

    const resetPasswordHandler = (resetPasswordData) => {
        onResetPassword({
            email: resetPasswordData.email,
        });
        setLoadingForm(true);
        resetFormHandler(RESET_PASSWORD_FORM);
    };

    const socialLoginHandler = (data) => {
        setLoadingForm(true);
        if (!data.token || data.token.length < 20) {
            setError({ login: t(BROKEN_TOKEN) });
            return;
        }
        setAuthType(authTypes.GOOGLE);
        onAuth(data);
        resetFormHandler(LOGIN_FORM);
        window.history.replaceState({}, document.title, '/');
        setLoadingForm(false);
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
        if (!isEmpty(response) || !isEmpty(resetPasswordResponse)) {
            const message =
                authType === authTypes.REGISTRATION
                    ? t(SUCCESSFUL_REGISTERED_MESSAGE)
                    : t(SUCCESSFUL_RESET_PASSWORD_MESSAGE);
            history.push(links.LOGIN);
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
        }
    }, [resetPasswordResponse, response]);

    useEffect(() => {
        if (userRole) {
            handleSnackbarOpenService(true, snackbarTypes.SUCCESS, t(SUCCESSFUL_LOGIN_MESSAGE));
            const redirectLink =
                userRole === userRoles.MANAGER ? links.ADMIN_PAGE : links.HOME_PAGE;
            history.push(redirectLink);
        }
    }, [userRole]);

    let authPage;

    switch (authType) {
        case authTypes.REGISTRATION:
            document.title = t(REGISTRATION_PAGE_TITLE);
            authPage = (
                <RegistrationForm
                    isLoading={isLoading}
                    registrationError={error}
                    onSubmit={registrationHandler}
                    translation={t}
                    setError={setError}
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
                    translation={t}
                    setError={setError}
                />
            );
            break;
        default:
            document.title = t(LOGIN_TITLE);
            authPage = (
                <LoginForm
                    isLoading={isLoading}
                    loginHandler={loginHandler}
                    setError={setError}
                    translation={t}
                    errors={error}
                />
            );
    }

    return <div className="auth-form">{authPage}</div>;
};

export default Auth;
