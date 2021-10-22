import React from 'react';
import i18n from 'i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import renderTextField from '../../share/renderedFields/input';
import Card from '../../share/Card/Card';

import { REGISTRATION_FORM } from '../../constants/reduxForms';

import { email, password, required } from '../../validation/validateFields';
import { links } from '../../constants/links';
import {
    REGISTRATION_PAGE_TITLE,
    ACCOUNT_EXIST,
    CREATE_ACCOUNT,
    DIFFERENT_PASSWORDS,
} from '../../constants/translationLabels/common';
import {
    PASSWORD_LABEL,
    RETYPE_PASSWORD_LABEL,
    EMAIL_LABEL,
} from '../../constants/translationLabels/formElements';

const RegistrationForm = (props) => {
    const { handleSubmit, errors, setError, registrationHandler, isLoading } = props;

    const emailValidate = { validate: [required, email] };
    const emailErrorCondition = errors && errors.registration.reg;
    const emailAdvancedValidate = {
        error: !!emailErrorCondition,
        helperText: emailErrorCondition ? errors.registration.reg : '',
    };

    const passwordValidate = { validate: [required, password] };
    const passwordsCondition = errors && errors.registration.passwords;
    const passwordValidateAdvanced = {
        error: !!passwordsCondition,
        helperText: passwordsCondition ? errors.registration.passwords : '',
    };

    const retypePasswordValidate = { validate: [required, password] };
    const retypePasswordValidateAdvanced = {
        error: !!passwordsCondition,
    };

    const isValidForm = (formValues) => {
        if (formValues.password !== formValues.retypePassword) {
            setError({
                registration: { passwords: i18n.t(DIFFERENT_PASSWORDS) },
            });
            return false;
        }
        return true;
    };
    const onRegistration = (values) => {
        const isValid = isValidForm(values);
        if (isValid) {
            registrationHandler(values);
        }
    };

    return (
        <Card additionClassName="auth-card">
            <h2 className="under-line">{i18n.t(REGISTRATION_PAGE_TITLE)}</h2>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <form onSubmit={handleSubmit(onRegistration)}>
                    <Field
                        name="email"
                        className="form-field"
                        type="email"
                        component={renderTextField}
                        label={i18n.t(EMAIL_LABEL)}
                        {...(!errors ? emailValidate : emailAdvancedValidate)}
                        onChange={() => props.setError(null)}
                    />
                    <Field
                        name="password"
                        className="form-field"
                        type="password"
                        component={renderTextField}
                        label={i18n.t(PASSWORD_LABEL)}
                        {...(!errors ? passwordValidate : passwordValidateAdvanced)}
                        onChange={() => props.setError(null)}
                    />
                    <Field
                        name="retypePassword"
                        className="form-field"
                        type="password"
                        component={renderTextField}
                        label={i18n.t(RETYPE_PASSWORD_LABEL)}
                        {...(!errors ? retypePasswordValidate : retypePasswordValidateAdvanced)}
                    />
                    <Button
                        className="buttons-style"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {i18n.t(CREATE_ACCOUNT)}
                    </Button>
                    <div className="text-center">
                        <Link className="navLinks" to={links.LOGIN}>
                            {i18n.t(ACCOUNT_EXIST)}
                        </Link>
                    </div>
                </form>
            )}
        </Card>
    );
};

const RegistrationReduxForm = reduxForm({
    form: REGISTRATION_FORM,
})(RegistrationForm);

export default RegistrationReduxForm;
