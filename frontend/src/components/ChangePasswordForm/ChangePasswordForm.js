import React from 'react';
import {Field, reduxForm} from 'redux-form';

import {connect} from 'react-redux';

import './ChangePasswordForm.scss';

import Button from '@mui/material/Button';
import {useTranslation} from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import renderTextField from '../../share/renderedFields/input';

import {password, required} from '../../validation/validateFields';

import {PROFILE_FORM} from '../../constants/reduxForms';
import {
    CHANGE_PASSWORD_FROM_TITLE,
    CLEAR_BUTTON_LABEL,
    NEW_PASSWORD_LABEL,
    PASSWORD_LABEL,
    RETYPE_PASSWORD_LABEL,
    SAVE_BUTTON_LABEL,
} from '../../constants/translationLabels/formElements';

function ExpandMoreIcon() {
    return null;
}

const ChangePasswordForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting } = props;

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{t(CHANGE_PASSWORD_FROM_TITLE)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <form onSubmit={handleSubmit}>
                            <Field
                                component={renderTextField}
                                className="form-field"
                                name="current_password"
                                id="current_password"
                                label={t(PASSWORD_LABEL)}
                                type="password"
                                validate={[required, password]}
                            />
                            <Field
                                component={renderTextField}
                                className="form-field"
                                name="new_password"
                                id="new_password"
                                label={t(NEW_PASSWORD_LABEL)}
                                type="password"
                                validate={[required, password]}
                            />
                            <Field
                                component={renderTextField}
                                className="form-field"
                                name="confirm_password"
                                id="confirm_password"
                                label={t(RETYPE_PASSWORD_LABEL)}
                                type="password"
                                validate={[required, password]}
                            />

                            <div className="form-buttons-container">
                                <Button
                                    className="buttons-style"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={pristine || submitting}
                                >
                                    {t(SAVE_BUTTON_LABEL)}
                                </Button>
                                <Button
                                    className="buttons-style"
                                    type="button"
                                    variant="contained"
                                    disabled={pristine || submitting}
                                    onClick={onReset}
                                >
                                    {t(CLEAR_BUTTON_LABEL)}
                                </Button>
                            </div>
                        </form>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default connect()(
    reduxForm({
        form: PROFILE_FORM,
    })(ChangePasswordForm),
);
