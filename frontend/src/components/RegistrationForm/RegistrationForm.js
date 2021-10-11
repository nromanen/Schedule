import React from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import renderTextField from '../../share/renderedFields/input';
import Card from '../../share/Card/Card';

import { REGISTRATION_FORM } from '../../constants/reduxForms';
import { authTypes } from '../../constants/auth';

import { email, password, required } from '../../validation/validateFields';
import { links } from '../../constants/links';
import {
    PASSWORD_LABEL,
    RETYPE_PASSWORD_LABEL,
    EMAIL_LABEL,
    REGISTRATION_PAGE_TITLE,
} from '../../constants/translationLabels';

let RegistrationForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit } = props;

    const { translation } = props;

    const error = props.registrationError;

    const emailValidate = { validate: [required, email] };
    const emailErrorCondition = error && error.registration.reg;
    const emailAdvancedValidate = {
        error: !!emailErrorCondition,
        helperText: emailErrorCondition ? error.registration.reg : '',
    };

    const passwordValidate = { validate: [required, password] };
    const passwordsCondition = error && error.registration.passwords;
    const passwordValidateAdvanced = {
        error: !!passwordsCondition,
        helperText: passwordsCondition ? error.registration.passwords : '',
    };

    const retypePasswordValidate = { validate: [required, password] };
    const retypePasswordValidateAdvanced = {
        error: !!passwordsCondition,
    };

    let form = (
        <form onSubmit={handleSubmit}>
            <Field
                name="email"
                className="form-field"
                type="email"
                component={renderTextField}
                label={t(EMAIL_LABEL)}
                {...(!error ? emailValidate : emailAdvancedValidate)}
                onChange={(e) => props.setError(null)}
            />
            <Field
                name="password"
                className="form-field"
                type="password"
                component={renderTextField}
                label={t(PASSWORD_LABEL)}
                {...(!error ? passwordValidate : passwordValidateAdvanced)}
                onChange={(e) => props.setError(null)}
            />
            <Field
                name="retypePassword"
                className="form-field"
                type="password"
                component={renderTextField}
                label={t(RETYPE_PASSWORD_LABEL)}
                {...(!error ? retypePasswordValidate : retypePasswordValidateAdvanced)}
            />
            <Button className="buttons-style" type="submit" variant="contained" color="primary">
                {translation('create_account')}
            </Button>
            <div className="group-btns">
                <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                        props.switchAuthMode(authTypes.LOGIN);
                        props.setError(null);
                    }}
                >
                    <Link className="navLinks" to={links.LOGIN}>
                        {translation('account_exist')}
                    </Link>
                </button>
            </div>
        </form>
    );

    if (props.isLoading) {
        form = <CircularProgress />;
    }
    return (
        <Card class="auth-card">
            <h2 className="under-line">{props.translation(REGISTRATION_PAGE_TITLE)}</h2>
            {form}
        </Card>
    );
};

RegistrationForm = reduxForm({
    form: REGISTRATION_FORM,
})(RegistrationForm);

export default RegistrationForm;
