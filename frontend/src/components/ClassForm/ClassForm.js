import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as moment from 'moment';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import './ClassForm.scss';
import FormWrapper from '../../share/FormWrapper/FormWrapper';
import { RHFTextField, RHFTimePicker } from '../../share/rhf';
import { CLASS_DURATION } from '../../constants/common';
import {
    CLASS_FROM_LABEL,
    CLASS_LABEL,
    CLASS_TO_LABEL,
    CLASS_Y_LABEL,
    CREATE_TITLE,
    EDIT_TITLE,
} from '../../constants/translationLabels/formElements';
import {
    BIGGER_THAN_FIELD_MESSAGE,
    LESS_THAN_FIELD_MESSAGE,
} from '../../constants/translationLabels/validationMessages';
import { hourFormat, timeFormat } from '../../constants/formats';
import { queryClient } from '../../queryClient';
import { CLASSES_QUERY_KEY } from '../../hooks/useClassSchedule';
import { checkUniqClassName, timeIntersectService } from '../../validation/storeValidation';

const ClassForm = ({ onSubmit, onReset, classSchedule }) => {
    const { t } = useTranslation('formElements');
    const classes = queryClient.getQueryData([CLASSES_QUERY_KEY]) || [];

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        trigger,
        formState: { isDirty, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            class_name: '',
            startTime: null,
            endTime: null,
        },
    });

    const startTime = watch('startTime');
    const endTime = watch('endTime');

    const handleStartTimeChange = (value) => {
        if (value) {
            const newEndTime = moment(value, timeFormat)
                .add(CLASS_DURATION, hourFormat)
                .format(timeFormat);
            setValue('endTime', newEndTime);
            trigger('startTime');
        }
    };

    useEffect(() => {
        reset({
            class_name: classSchedule?.class_name || '',
            startTime: classSchedule?.startTime || null,
            endTime: classSchedule?.endTime || null,
        });
    }, [classSchedule, reset]);

    const handleReset = () => {
        onReset();
        reset({ class_name: '', startTime: null, endTime: null });
    };

    const onFormSubmit = (values) => {
        onSubmit({ ...values, id: classSchedule?.id });
    };

    return (
        <FormWrapper
            title={`${classSchedule?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} ${t(CLASS_Y_LABEL)}`}
            onSubmit={handleSubmit(onFormSubmit)}
            onReset={handleReset}
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            entityId={classSchedule?.id}
        >
            <RHFTextField
                control={control}
                name="class_name"
                label={t(CLASS_LABEL)}
                className="form-field"
                rules={{
                    required: t('required'),
                    validate: (value) => checkUniqClassName(value, classes, classSchedule?.id),
                }}
            />
            <div className="form-time-block">
                <RHFTimePicker
                    control={control}
                    name="startTime"
                    label={t(CLASS_FROM_LABEL)}
                    className="time-input"
                    onChange={handleStartTimeChange}
                    rules={{
                        required: t('required'),
                        validate: {
                            lessThan: (value) =>
                                !endTime ||
                                moment(value, 'HH:mm').toDate() <=
                                moment(endTime, 'HH:mm').toDate() ||
                                i18n.t(LESS_THAN_FIELD_MESSAGE, { field: t(CLASS_TO_LABEL) }),
                            noIntersect: (value) => {
                                const error = timeIntersectService(value, endTime, classes, classSchedule?.id);
                                return error ? error : true;
                            },
                        },
                    }}
                />
                <RHFTimePicker
                    control={control}
                    name="endTime"
                    label={t(CLASS_TO_LABEL)}
                    className="time-input"
                    rules={{
                        required: t('required'),
                        validate: {
                            greaterThan: (value) =>
                                !startTime ||
                                moment(value, 'HH:mm').toDate() >=
                                moment(startTime, 'HH:mm').toDate() ||
                                i18n.t(BIGGER_THAN_FIELD_MESSAGE, { field: t(CLASS_FROM_LABEL) }),
                        },
                    }}
                />
            </div>
        </FormWrapper>
    );
};

export default ClassForm;