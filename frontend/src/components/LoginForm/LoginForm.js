import React, { useEffect } from 'react';
import i18n from 'i18next';
import { Link } from 'react-router-dom';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';
import { validation } from '../../constants/validation';
import { EMAIL_MESSAGE } from '../../constants/translationLabels/validationMessages';

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
    CREATE_ACCOUNT_LABEL,
    FORGOT_PASSWORD_LABEL,
} from '../../constants/translationLabels/formElements';
import { LOGIN_TITLE, EMPTY_FIELDS } from '../../constants/translationLabels/common';
import { links } from '../../constants/links';

const LoginForm = (props) => {
    const { handleSubmit, loginHandler, errors, setError, isLoading } = props;

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
    return (
        <Card additionClassName="auth-card">
            <h2 className="under-line">{i18n.t(LOGIN_TITLE)}</h2>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onLogin)}>
                    <Field
                        name="email"
                        className="form-field"
                        component={renderTextField}
                        label={i18n.t(`formElements:${EMAIL_LABEL}`)}
                        error={!!errors}
                        helperText={errors ? errors.login : null}
                        onChange={(e) => errorHandling(e.target.value)}
                    />
                    <Field
                        name="password"
                        className="form-field"
                        type="password"
                        component={renderTextField}
                        label={i18n.t(`formElements:${PASSWORD_LABEL}`)}
                        error={!!errors}
                        onChange={() => setError(null)}
                    />
                    <Button
                        className="buttons-style"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {i18n.t(LOGIN_TITLE)}
                    </Button>
                </form>
            )}
            <div className="text-center">
                <Link to={links.Registration} className="navLinks">
                    {i18n.t(`formElements:${CREATE_ACCOUNT_LABEL}`)}
                </Link>
                <Link to={links.RESET_PASSWORD} className="navLinks">
                    {i18n.t(`formElements:${FORGOT_PASSWORD_LABEL}`)}
                </Link>
            </div>
        </Card>
    );
};

const LoginReduxForm = reduxForm({
    form: LOGIN_FORM,
})(LoginForm);

export default LoginReduxForm;
