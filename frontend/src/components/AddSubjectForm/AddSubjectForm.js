import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import './AddSubjectForm.scss';
import Card from '../../share/Card/Card';
import { RHFTextField } from '../../share/rhf';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { checkUniqueSubject } from '../../validation/storeValidation';
import { queryClient } from '../../queryClient';
import { SUBJECTS_QUERY_KEY } from '../../hooks/useSubjects';
import {
    CREATE_TITLE,
    EDIT_TITLE,
    SAVE_BUTTON_LABEL,
    SUBJECT_LABEL,
    SUBJECT_Y_LABEL,
} from '../../constants/translationLabels/formElements';

const AddSubjectForm = ({ onSubmit, onReset, subject }) => {
    const { t } = useTranslation('formElements');
    const subjects = queryClient.getQueryData([SUBJECTS_QUERY_KEY]) || [];

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: { name: '' },
    });

    useEffect(() => {
        reset({ name: subject?.name || '' });
    }, [subject, reset]);

    const handleReset = () => {
        onReset();
        reset({ name: '' });
    };

    const onFormSubmit = (values) => {
        onSubmit({ ...values, name: values.name.trim(), id: subject?.id });
        reset({ name: '' });
    };

    return (
        <Card additionClassName="form-card subject-form">
            <h2 style={{ textAlign: 'center' }}>
                {subject?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(SUBJECT_Y_LABEL)}
            </h2>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <RHFTextField
                    control={control}
                    name="name"
                    label={`${t(SUBJECT_LABEL)}:`}
                    className="form-field"
                    rules={{
                        required: t('required'),
                        validate: (value) =>
                            checkUniqueSubject(value, subjects, subject?.id),
                    }}
                />
                <div className="form-buttons-container form-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style"
                        disabled={!isDirty || isSubmitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={setDisableButton(!isDirty, isSubmitting, subject?.id)}
                        onClick={handleReset}
                    >
                        {getClearOrCancelTitle(subject?.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default AddSubjectForm;