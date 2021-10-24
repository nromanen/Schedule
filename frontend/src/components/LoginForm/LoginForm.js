import React, { useEffect } from 'react';
import i18n from 'i18next';

import { Link } from 'react-router-dom';
import '../../styles/forms.scss';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleLogin from 'react-google-login';
import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';
import { validation } from '../../constants/validation';
import { EMAIL_MESSAGE } from '../../constants/translationLabels/validationMessages';
import { GOOGLE } from '../../constants/common';

import { required } from '../../validation/validateFields';
import {
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';
import {
    PASSWORD_LABEL,
    EMAIL_LABEL,
    FORGOT_PASSWORD_LABEL,
    DONT_HAVE_ACCOUNT_LABEL,
    SING_IN_TO_ACCOUNT_LABEL,
    LOGIN_VIA_GOOGLE_LABEL,
} from '../../constants/translationLabels/formElements';
import {
    LOGIN_TITLE,
    EMPTY_FIELDS,
    OR_LABEL,
    REGISTRATION_PAGE_TITLE,
} from '../../constants/translationLabels/common';
import { links } from '../../constants/links';
import { GOOGLE_AUTH_CLIENT_ID } from '../../constants/auth';

const LoginForm = (props) => {
    const { handleSubmit, loginHandler, socialLoginHandler, errors, setError, isLoading } = props;

    useEffect(() => {
        setScheduleSemesterIdService(0);
        setScheduleTeacherIdService(0);
        setScheduleGroupIdService(0);
        setScheduleTypeService('');
    });
    const isValidForm = (formValues) => {
        if (!formValues.email || !formValues.password) {
            setError({ login: i18n.t(EMPTY_FIELDS) });
            return false;
        }
        if (!validation.EMAIL.test(formValues.email)) {
            setError({ login: i18n.t(EMAIL_MESSAGE) });
            return false;
        }
        return true;
    };
    const onLogin = (values) => {
        const isValid = isValidForm(values);
        if (isValid) {
            loginHandler(values);
        }
    };
    const errorHandling = (value) => {
        if (required(value)) setError(required(value));
        else setError(null);
    };
    const responseGoogle = (response) => {
        console.log(response);
    };
    return (
        <Card additionClassName="auth-card">
            <div className="auth-card-header">
                <h2 className="title">{i18n.t(LOGIN_TITLE)}</h2>
                <span className="subtitle">{i18n.t(SING_IN_TO_ACCOUNT_LABEL)}</span>
                <div className="login-via-social-container">
                    <GoogleLogin
                        clientId={GOOGLE_AUTH_CLIENT_ID}
                        render={(renderProps) => (
                            <button
                                className="google-avatar"
                                title={i18n.t(LOGIN_VIA_GOOGLE_LABEL)}
                                type="button"
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                            >
                                <img
                                    alt={i18n.t(LOGIN_VIA_GOOGLE_LABEL)}
                                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                                />
                            </button>
                        )}
                        onSuccess={(res) =>
                            // console.log(res)
                            socialLoginHandler({
                                authType: GOOGLE,
                                token: res.tokenObj.id_token,
                            })
                        }
                        onFailure={responseGoogle}
                        cookiePolicy="single_host_origin"
                    />
                </div>
                <div className="or-lines-container">
                    <span className="line"></span>
                    <span className="line-text">{i18n.t(OR_LABEL)}</span>
                    <span className="line"></span>
                </div>
            </div>

            {isLoading ? (
                <CircularProgress size="60px" className="loading-circle" />
            ) : (
                <form onSubmit={handleSubmit(onLogin)} className="auth-form">
                    <Field
                        name="email"
                        className="form-input"
                        component={renderTextField}
                        label={i18n.t(EMAIL_LABEL)}
                        error={!!errors}
                        helperText={errors ? errors.login : null}
                        onChange={(e) => errorHandling(e.target.value)}
                    />
                    <Field
                        name="password"
                        className="form-input"
                        type="password"
                        component={renderTextField}
                        label={i18n.t(PASSWORD_LABEL)}
                        error={!!errors}
                        onChange={() => setError(null)}
                    />
                    <div className="forgot-password-label">
                        <Link to={links.RESET_PASSWORD} className="form-link">
                            {i18n.t(FORGOT_PASSWORD_LABEL)}
                        </Link>
                    </div>
                    <div className="auth-form-actions">
                        <Button
                            className="auth-confirm-button"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {i18n.t(LOGIN_TITLE)}
                        </Button>
                    </div>

                    <div className="auth-form-footer">
                        <span>{i18n.t(DONT_HAVE_ACCOUNT_LABEL)}</span>
                        <Link to={links.Registration} className="form-link">
                            {i18n.t(REGISTRATION_PAGE_TITLE)}
                        </Link>
                    </div>
                </form>
            )}
        </Card>
    );
};

const LoginReduxForm = reduxForm({
    form: LOGIN_FORM,
})(LoginForm);

export default LoginReduxForm;
