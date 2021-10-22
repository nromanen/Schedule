import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { links } from '../../constants/links';
import { authTypes, successAuthMessages } from '../../constants/auth';
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
    HOME_TITLE,
    ADMIN_TITLE,
    RESET_PASSWORD_PAGE_TITLE,
} from '../../constants/translationLabels/common';

const Auth = (props) => {
    const {
        authType,
        userRole,
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
    const history = useHistory();
    const location = useLocation();
    const loginHandler = (loginData) => {
        onAuth(loginData);
        setLoadingForm(true);
        resetFormHandler(LOGIN_FORM);
    };

    const showSuccessMessage = (massage) => {
        handleSnackbarOpenService(true, snackbarTypes.SUCCESS, t(massage));
    };

    const successLoginRedirect = () => {
        if (userRole === userRoles.MANAGER) {
            document.title = t(ADMIN_TITLE);
            history.push(links.ADMIN_PAGE);
        } else {
            document.title = t(HOME_TITLE);
            history.push(links.HOME_PAGE);
        }
        showSuccessMessage(successAuthMessages[authType]);
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
        onAuth(data);
        resetFormHandler(LOGIN_FORM);
    };

    let social = false;
    let isToken = false;
    let splitedParamToken = '';
    if (location.search.length > 0) {
        const params = location.search.split('&');
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
            history.push(links.LOGIN);
            showSuccessMessage(successAuthMessages[authType]);
        }
    }, [resetPasswordResponse, response]);

    useEffect(() => {
        if (userRole) {
            successLoginRedirect();
        }
    }, [userRole]);

    switch (authType) {
        case authTypes.REGISTRATION:
            document.title = t(REGISTRATION_PAGE_TITLE);
            return (
                <div className="auth-container">
                    <RegistrationForm
                        isLoading={isLoading}
                        registrationError={error}
                        registrationHandler={registrationHandler}
                        setError={setError}
                    />
                </div>
            );
        case authTypes.RESET_PASSWORD:
            document.title = t(RESET_PASSWORD_PAGE_TITLE);
            return (
                <div className="auth-container">
                    <ResetPasswordForm
                        isLoading={isLoading}
                        resetPasswordError={error}
                        onSubmit={resetPasswordHandler}
                        translation={t}
                        setError={setError}
                    />
                </div>
            );
        default:
            document.title = t(LOGIN_TITLE);
            return (
                <div className="auth-container">
                    <LoginForm
                        isLoading={isLoading}
                        loginHandler={loginHandler}
                        setError={setError}
                        errors={error}
                    />
                </div>
            );
    }
};

export default Auth;
