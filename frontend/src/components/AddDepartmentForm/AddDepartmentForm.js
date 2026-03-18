import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormWrapper from '../../share/FormWrapper/FormWrapper';
import { RHFTextField } from '../../share/rhf';
import { checkUniqueDepartment } from '../../validation/storeValidation';
import { queryClient } from '../../queryClient';
import { DEPARTMENTS_QUERY_KEY } from '../../hooks/useDepartments';
import {
    CREATE_TITLE,
    DEPARTMENT_LABEL,
    EDIT_TITLE,
    NAME_LABEL,
} from '../../constants/translationLabels/formElements';

const AddDepartmentForm = ({ onSubmit, onReset, department }) => {
    const { t } = useTranslation('formElements');
    const departments = queryClient.getQueryData([DEPARTMENTS_QUERY_KEY]) || [];

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
        reset({ name: department?.name || '' });
    }, [department, reset]);

    const handleReset = () => {
        onReset();
        reset({ name: '' });
    };

    const onFormSubmit = (values) => {
        onSubmit({ ...values, name: values.name.trim(), id: department?.id });
        reset({ name: '' });
    };

    return (
        <FormWrapper
            title={`${department?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} ${t(DEPARTMENT_LABEL)}`}
            onSubmit={handleSubmit(onFormSubmit)}
            onReset={handleReset}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            entityId={department?.id}
        >
            <RHFTextField
                control={control}
                name="name"
                label={`${t(NAME_LABEL)}:`}
                className="form-field"
                rules={{
                    required: t('required'),
                    validate: (value) => checkUniqueDepartment(value, departments, department?.id),
                }}
            />
        </FormWrapper>
    );
};

export default AddDepartmentForm;