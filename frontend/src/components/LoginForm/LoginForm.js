import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';

import { required } from '../../validation/validateFields';
import {
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';

const LoginForm = (props) => {
    useEffect(() => {
        setScheduleSemesterIdService(0);
        setScheduleTeacherIdService(0);
        setScheduleGroupIdService(0);
        setScheduleTypeService('');
    });
    const { t } = useTranslation('formElements');
    const { handleSubmit } = props;

    const error = props.loginError;

    const { translation } = props;

    const errorHandling = (value) => {
        if (required(value)) props.setError(required(value));
        else props.setError(null);
    };

    let form = (
        <form onSubmit={handleSubmit}>
            <Field
                name="email"
                className="form-field"
                component={renderTextField}
                label={t('email_label')}
                error={!!error}
                helperText={error ? error.login : null}
                onChange={(e) => errorHandling(e.target.value)}
            />
            <Field
                name="password"
                className="form-field"
                type="password"
                component={renderTextField}
                label={t('password_label')}
                error={!!error}
                onChange={() => props.setError(null)}
            />
            <Button
                className="buttons-style under-line"
                type="submit"
                variant="contained"
                color="primary"
            >
                {translation('login_title')}
            </Button>
        </form>
    );

    if (props.isLoading) {
        form = <CircularProgress />;
    }

    return (
        <Card class="auth-card">
            <h2 className="under-line">{translation('login_page_title')}</h2>
            {form}
        </Card>
    );
};

const LoginReduxForm = reduxForm({
    form: LOGIN_FORM,
})(LoginForm);

export default LoginReduxForm;
