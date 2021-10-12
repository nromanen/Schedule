import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import * as moment from 'moment';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';

import '../LessonForm/LessonForm';
import './ClassForm.scss';

import renderTextField from '../../share/renderedFields/input';
import renderTimePicker from '../../share/renderedFields/time';

import {
    required,
    greaterThanTime,
    lessThanTime,
    uniqueClassName,
    timeIntersect,
} from '../../validation/validateFields';

import { CLASS_FORM } from '../../constants/reduxForms';
import { CLASS_DURATION } from '../../constants/common';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    CLASS_LABEL,
    CLASS_FROM_LABEL,
    CLASS_TO_LABEL,
    CLASS_Y_LABEL,
} from '../../constants/translationLabels/formElements';

const ClassFormFunc = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting, classScheduleOne } = props;
    useEffect(() => {
        let initialValues = {};
        if (classScheduleOne) {
            initialValues = classScheduleOne;
        }
        props.initialize(initialValues);
    }, [classScheduleOne]);

    const setEndTime = (startTime) =>
        props.change(
            'endTime',
            moment(startTime, 'HH:mm').add(CLASS_DURATION, 'h').format('HH:mm'),
        );

    return (
        <Card class="form-card">
            <h2 className="form-title">
                {props.classScheduleOne.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(CLASS_Y_LABEL)}
            </h2>
            <form onSubmit={handleSubmit}>
                <Field
                    component={renderTextField}
                    className="form-field"
                    name="class_name"
                    id="class_name"
                    label={t(CLASS_LABEL)}
                    type="text"
                    validate={[required, uniqueClassName]}
                />
                <div className="form-time-block">
                    <Field
                        component={renderTimePicker}
                        className="time-input"
                        name="startTime"
                        label={t(CLASS_FROM_LABEL)}
                        type="time"
                        validate={[required, lessThanTime, timeIntersect]}
                        onChange={(event, value) => {
                            if (value) {
                                setEndTime(value);
                            }
                        }}
                    />
                    <Field
                        component={renderTimePicker}
                        className="time-input"
                        name="endTime"
                        label={t(CLASS_TO_LABEL)}
                        type="time"
                        validate={[required, greaterThanTime, timeIntersect]}
                    />
                </div>

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
                        disabled={setDisableButton(pristine, submitting, classScheduleOne.id)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(classScheduleOne.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    classScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: CLASS_FORM,
    })(ClassFormFunc),
);
