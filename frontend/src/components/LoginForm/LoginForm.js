import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from 'react-redux';
import Card from '../../share/Card/Card';
import renderTextField from '../../share/renderedFields/input';

import { LOGIN_FORM } from '../../constants/reduxForms';

import { required } from '../../validation/validateFields';
import { PASSWORD_LABEL, EMAIL_LABEL } from '../../constants/translationLabels/formElements';
import { LOGIN_TITLE } from '../../constants/translationLabels/common';
import {
    setScheduleSemesterId,
    setScheduleType,
    setScheduleGroupId,
    setScheduleTeacherId,
} from '../../actions';

const LoginForm = (props) => {
    const {
        handleSubmit,
        loginError,
        translation,
        setError,
        isLoading,
        setSemesterId,
        setTypeOfSchedule,
        setGroupId,
        setTeacherId,
    } = props;
    useEffect(() => {
        setSemesterId(0);
        setTeacherId(0);
        setGroupId(0);
        setTypeOfSchedule('full');
    });
    const { t } = useTranslation('formElements');

    const error = loginError;

    const errorHandling = (value) => {
        if (required(value)) setError(required(value));
        else setError(null);
    };

    let form = (
        <form onSubmit={handleSubmit}>
            <Field
                name="email"
                className="form-field"
                component={renderTextField}
                label={t(EMAIL_LABEL)}
                error={!!error}
                helperText={error ? error.login : null}
                onChange={(e) => errorHandling(e.target.value)}
            />
            <Field
                name="password"
                className="form-field"
                type="password"
                component={renderTextField}
                label={t(PASSWORD_LABEL)}
                error={!!error}
                onChange={() => props.setError(null)}
            />
            <Button
                className="buttons-style under-line"
                type="submit"
                variant="contained"
                color="primary"
            >
                {translation(LOGIN_TITLE)}
            </Button>
        </form>
    );

    if (isLoading) {
        form = <CircularProgress />;
    }

    return (
        <Card additionClassName="auth-card">
            <h2 className="under-line">{translation(LOGIN_TITLE)}</h2>
            {form}
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
