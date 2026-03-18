import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormWrapper from '../../share/FormWrapper/FormWrapper';
import { RHFTextField } from '../../share/rhf';
import { checkUniqueSubject } from '../../validation/storeValidation';
import { queryClient } from '../../queryClient';
import { SUBJECTS_QUERY_KEY } from '../../hooks/useSubjects';
import {
    CREATE_TITLE,
    EDIT_TITLE,
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
        <FormWrapper
            title={`${subject?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} ${t(SUBJECT_Y_LABEL)}`}
            onSubmit={handleSubmit(onFormSubmit)}
            onReset={handleReset}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            entityId={subject?.id}
        >
            <RHFTextField
                control={control}
                name="name"
                label={`${t(SUBJECT_LABEL)}:`}
                className="form-field"
                rules={{
                    required: t('required'),
                    validate: (value) => checkUniqueSubject(value, subjects, subject?.id),
                }}
            />
        </FormWrapper>
    );
};

export default AddSubjectForm;