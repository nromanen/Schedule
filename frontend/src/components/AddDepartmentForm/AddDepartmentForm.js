import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import Card from '../../share/Card/Card';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { RHFTextField } from '../../share/rhf';
import { checkUniqueDepartment } from '../../validation/storeValidation';
import {
    CREATE_TITLE,
    DEPARTMENT_LABEL,
    EDIT_TITLE,
    NAME_LABEL,
    SAVE_BUTTON_LABEL,
} from '../../constants/translationLabels/formElements';
import { DEPARTMENTS_QUERY_KEY } from '../../hooks/useDepartments';
import { queryClient } from '../../queryClient';

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
        defaultValues: {
            name: '',
        },
    });

    // Populate form when editing
    useEffect(() => {
        reset({
            name: department?.name || '',
        });
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
        <Card additionClassName="form-card subject-form">
            <h2 style={{ textAlign: 'center' }}>
                {department?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(DEPARTMENT_LABEL)}
            </h2>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <RHFTextField
                    control={control}
                    name="name"
                    label={`${t(NAME_LABEL)}:`}
                    className="form-field"
                    rules={{
                        required: t('required'),
                        validate: (value) =>
                            checkUniqueDepartment(value, departments, department?.id),
                    }}
                />
                <div className="form-buttons-container subject-btns">
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
                        disabled={setDisableButton(!isDirty, isSubmitting, department?.id)}
                        onClick={handleReset}
                    >
                        {getClearOrCancelTitle(department?.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default AddDepartmentForm;