import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { RHFTextField } from '../../share/rhf';
import FormWrapper from '../../share/FormWrapper/FormWrapper';
import { password, required } from '../../validation/validateFields';

import {
    CHANGE_PASSWORD_FROM_TITLE,
    NEW_PASSWORD_LABEL,
    PASSWORD_LABEL,
    RETYPE_PASSWORD_LABEL,
} from '../../constants/translationLabels/formElements';
import { DIFFERENT_PASSWORDS } from '../../constants/translationLabels/common';

import './ChangePasswordForm.scss';

const wrapValidators = (validators) =>
    validators.reduce((acc, validator, idx) => {
        acc[`v${idx}`] = (value, formValues) => {
            const result = validator(value, undefined, { values: formValues });
            return result === undefined || result === '' ? true : result;
        };
        return acc;
    }, {});

const ChangePasswordForm = ({ onSubmit, onReset }) => {
    const { t } = useTranslation('formElements');

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
    });

    const handleFormSubmit = (values) => {
        onSubmit(values);
    };

    const handleFormReset = () => {
        if (onReset) onReset();
        reset({
            current_password: '',
            new_password: '',
            confirm_password: '',
        });
    };

    const passwordRules = wrapValidators([required, password]);

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>{t(CHANGE_PASSWORD_FROM_TITLE)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormWrapper
                    title=""
                    onSubmit={handleSubmit(handleFormSubmit)}
                    onReset={handleFormReset}
                    isDirty={isDirty}
                    isSubmitting={isSubmitting}
                    entityId={null}
                    noCard
                >
                    <RHFTextField
                        control={control}
                        name="current_password"
                        id="current_password"
                        label={t(PASSWORD_LABEL)}
                        type="password"
                        className="form-field"
                        rules={passwordRules}
                    />
                    <RHFTextField
                        control={control}
                        name="new_password"
                        id="new_password"
                        label={t(NEW_PASSWORD_LABEL)}
                        type="password"
                        className="form-field"
                        rules={passwordRules}
                    />
                    <RHFTextField
                        control={control}
                        name="confirm_password"
                        id="confirm_password"
                        label={t(RETYPE_PASSWORD_LABEL)}
                        type="password"
                        className="form-field"
                        rules={{
                            validate: {
                                ...passwordRules.validate,
                                match: (value, formValues) =>
                                    value === formValues.new_password ||
                                    t(DIFFERENT_PASSWORDS, { ns: 'common' }),
                            },
                        }}
                    />
                </FormWrapper>
            </AccordionDetails>
        </Accordion>
    );
};

export default ChangePasswordForm;