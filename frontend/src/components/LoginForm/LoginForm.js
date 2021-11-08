import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../../styles/forms.scss';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';

import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';
import { validation } from '../../constants/validation';
import { EMAIL_MESSAGE } from '../../constants/translationLabels/validationMessages';

import { required } from '../../validation/validateFields';
import {
    PASSWORD_LABEL,
    EMAIL_LABEL,
    FORGOT_PASSWORD_LABEL,
    DONT_HAVE_ACCOUNT_LABEL,
} from '../../constants/translationLabels/formElements';
import {
    LOGIN_TITLE,
    EMPTY_FIELDS,
    REGISTRATION_PAGE_TITLE,
} from '../../constants/translationLabels/common';
import { REGISTRATION_LINK, RESET_PASSWORD_LINK } from '../../constants/links';
import {
    setScheduleSemesterId,
    setScheduleType,
    setScheduleGroupId,
    setScheduleTeacherId,
} from '../../actions';

const LoginForm = (props) => {
    const {
        handleSubmit,
        loginHandler,
        errors,
        setError,
        isLoading,
        setSemesterId,
        setTypeOfSchedule,
        setGroupId,
        setTeacherId,
    } = props;
    const { t } = useTranslation('common');
    useEffect(() => {
        setSemesterId(0);
        setTeacherId(0);
        setGroupId(0);
        setTypeOfSchedule('full');
    });
    const isValidForm = (formValues) => {
        if (!formValues.email || !formValues.password) {
            setError({ login: t(EMPTY_FIELDS) });
            return false;
        }
        if (!validation.EMAIL.test(formValues.email)) {
            setError({ login: t(EMAIL_MESSAGE) });
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
        <Card className="auth-card">
            <div className="auth-card-header">
                <h2 className="title">{t(LOGIN_TITLE)}</h2>
            </div>

            {isLoading ? (
                <CircularProgress size="70px" className="loading-circle auth-loading" />
            ) : (
                <form onSubmit={handleSubmit(onLogin)} className="auth-form">
                    <Field
                        name="email"
                        className="form-input"
                        component={renderTextField}
                        label={t(EMAIL_LABEL)}
                        error={!!errors}
                        helperText={errors ? errors.login : null}
                        onChange={(e) => errorHandling(e.target.value)}
                    />
                    <Field
                        name="password"
                        className="form-input"
                        type="password"
                        component={renderTextField}
                        label={t(PASSWORD_LABEL)}
                        error={!!errors}
                        onChange={() => setError(null)}
                    />
                    <div className="forgot-password-label">
                        <Link to={RESET_PASSWORD_LINK} className="form-link">
                            {t(FORGOT_PASSWORD_LABEL)}
                        </Link>
                    </div>
                    <div className="auth-form-actions">
                        <Button
                            className="auth-confirm-button"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {t(LOGIN_TITLE)}
                        </Button>
                    </div>

                    <div className="auth-form-footer">
                        <span>{t(DONT_HAVE_ACCOUNT_LABEL)}</span>
                        <Link to={REGISTRATION_LINK} className="form-link">
                            {t(REGISTRATION_PAGE_TITLE)}
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

const mapDispatchToProps = (dispatch) => ({
    setSemesterId: (id) => dispatch(setScheduleSemesterId(id)),
    setTypeOfSchedule: (type) => dispatch(setScheduleType(type)),
    setGroupId: (id) => dispatch(setScheduleGroupId(id)),
    setTeacherId: (id) => dispatch(setScheduleTeacherId(id)),
});

export default connect(null, mapDispatchToProps)(LoginReduxForm);
