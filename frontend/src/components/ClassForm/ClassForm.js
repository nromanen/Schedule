import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import * as moment from 'moment';
import Button from '@material-ui/core/Button';
import {useTranslation} from 'react-i18next';
import Card from '../../share/Card/Card';

import './ClassForm.scss';

import {CLASS_DURATION} from '../../constants/common';
import {getClearOrCancelTitle, setDisableButton} from '../../helper/disableComponent';
import {
    CLASS_FROM_LABEL,
    CLASS_LABEL,
    CLASS_TO_LABEL,
    CLASS_Y_LABEL,
    CREATE_TITLE,
    EDIT_TITLE,
    SAVE_BUTTON_LABEL,
} from '../../constants/translationLabels/formElements';
import {hourFormat, timeFormat} from '../../constants/formats';
import {queryClient} from '../../queryClient';
import {CLASSES_QUERY_KEY} from '../../hooks/useClassSchedule';
import {checkUniqClassName, timeIntersectService} from '../../validation/storeValidation';
import {RHFTextField, RHFTimePicker} from '../../share/rhf';
import i18n from "i18next";
import {BIGGER_THAN_FIELD_MESSAGE, LESS_THAN_FIELD_MESSAGE} from "../../constants/translationLabels/validationMessages";

const ClassForm = ({onSubmit, onReset, classSchedule}) => {
    const {t} = useTranslation('formElements');
    const classes = queryClient.getQueryData([CLASSES_QUERY_KEY]) || [];

    // const {
    //     control,
    //     handleSubmit,
    //     reset,
    //     setValue,
    //     watch,
    //     formState: {isDirty, isSubmitting},
    // } = useForm({
    //     defaultValues: {
    //         class_name: '',
    //         startTime: null,
    //         endTime: null,
    //     },
    // });
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        trigger,
        formState: {isDirty, isSubmitting},
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            class_name: '',
            startTime: null,
            endTime: null,
        },
    });

    const handleStartTimeChange = (value) => {
        if (value) {
            const newEndTime = moment(value, timeFormat)
                .add(CLASS_DURATION, hourFormat)
                .format(timeFormat);
            setValue('endTime', newEndTime);
            trigger('startTime');
        }
    };

    const startTime = watch('startTime');
    const endTime = watch('endTime');

    useEffect(() => {
        reset({
            class_name: classSchedule?.class_name || '',
            startTime: classSchedule?.startTime || null,
            endTime: classSchedule?.endTime || null,
        });
    }, [classSchedule, reset]);


    const handleReset = () => {
        onReset();
        reset({class_name: '', startTime: null, endTime: null});
    };

    const onFormSubmit = (values) => {
        onSubmit({...values, id: classSchedule?.id});
    };

    return (
        <Card additionClassName="form-card">
            <h2 className="form-title">
                {classSchedule?.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(CLASS_Y_LABEL)}
            </h2>
            <form onSubmit={handleSubmit(onFormSubmit)}>
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
                                    i18n.t(LESS_THAN_FIELD_MESSAGE, {field: t(CLASS_TO_LABEL)}),
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
                                    i18n.t(BIGGER_THAN_FIELD_MESSAGE, {field: t(CLASS_FROM_LABEL)}),
                            },
                        }}
                    />
                </div>

                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isDirty || isSubmitting}
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        type="button"
                        variant="contained"
                        disabled={setDisableButton(!isDirty, isSubmitting, classSchedule?.id)}
                        onClick={handleReset}
                    >
                        {getClearOrCancelTitle(classSchedule?.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ClassForm;