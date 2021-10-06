import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';
import { authTypes } from '../../constants/auth';
import { GOOGLE_LOGIN_URL } from '../../constants/axios';

import { required } from '../../validation/validateFields';
import { links } from '../../constants/links';
import {
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';

let LoginForm = (props) => {
    useEffect(() => setScheduleSemesterIdService(0));
    useEffect(() => setScheduleTeacherIdService(0));
    useEffect(() => setScheduleGroupIdService(0));
    useEffect(() => setScheduleTypeService(''));
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
            {/* <div className="group-btns"> */}
            {/*    <button */}
            {/*        type="button" */}
            {/*        className="auth-link" */}
            {/*        onClick={() => { */}
            {/*            props.switchAuthMode(authTypes.REGISTRATION); */}
            {/*            props.setError(null); */}
            {/*        }} */}
            {/*    > */}
            {/*       <Link  className="navLinks" to={links.Registration}>{translation('no_account')}</Link> */}
            {/*    </button> */}
            {/*    <button */}
            {/*        type="button" */}
            {/*        className="auth-link" */}
            {/*        onClick={() => { */}
            {/*            props.switchAuthMode(authTypes.RESET_PASSWORD); */}
            {/*            props.setError(null); */}
            {/*        }} */}
            {/*    > */}
            {/*       <Link  className="navLinks" to={links.RESET_PASSWORD}>{translation('forgot_password')}</Link> */}
            {/*    </button> */}
            {/* </div> */}

            {/* <Button */}
            {/*    variant="contained" */}
            {/*    color="secondary" */}
            {/*    onClick={() => */}
            {/*        (window.document.location.href = */}
            {/*            process.env.REACT_APP_API_BASE_URL.trim() +*/}
            {/*            GOOGLE_LOGIN_URL) */}
            {/*    } */}
            {/* > */}
            {/*    <FaGoogle /> */}
            {/*    {t('login_via_google')} */}
            {/* </Button> */}
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

LoginForm = reduxForm({
    form: LOGIN_FORM,
})(LoginForm);

export default LoginForm;
