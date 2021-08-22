import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';

import './ChangePasswordForm.scss';

import renderTextField from '../../share/renderedFields/input';

import Button from '@material-ui/core/Button';

import { required, password } from '../../validation/validateFields';

import { PROFILE_FORM } from '../../constants/reduxForms';
import { useTranslation } from 'react-i18next';
import NavigationPage from '../Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


function ExpandMoreIcon() {
    return null;
}

let ChangePasswordForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting } = props;

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                >
                    <Typography>{t('change_password_form_title')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <form onSubmit={handleSubmit}>
                            <Field
                                component={renderTextField}
                                className='form-field'
                                name='current_password'
                                id='current_password'
                                label={t('password_label')}
                                type='password'
                                validate={[required, password]}
                            />
                            <Field
                                component={renderTextField}
                                className='form-field'
                                name='new_password'
                                id='new_password'
                                label={t('new_password_label')}
                                type='password'
                                validate={[required, password]}
                            />
                            <Field
                                component={renderTextField}
                                className='form-field'
                                name='confirm_password'
                                id='confirm_password'
                                label={t('retype_password_label')}
                                type='password'
                                validate={[required, password]}
                            />

                            <div className='form-buttons-container'>
                                <Button
                                    className='buttons-style'
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    disabled={pristine || submitting}
                                >
                                    {t('save_button_label')}
                                </Button>
                                <Button
                                    className='buttons-style'
                                    type='button'
                                    variant='contained'
                                    disabled={pristine || submitting}
                                    onClick={onReset}
                                >
                                    {t('clear_button_label')}
                                </Button>
                            </div>
                        </form>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(
    reduxForm({
        form: PROFILE_FORM
    })(ChangePasswordForm)
);
