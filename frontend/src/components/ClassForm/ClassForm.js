import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import * as moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
    rootInput: {
        width: '20em',
    },
}));

const ClassFormFunc = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting, classScheduleOne } = props;
    const classes = useStyles();

    useEffect(() => {
        let initialValues = {};
        if (props.classScheduleOne) {
            initialValues = props.classScheduleOne;
        }
        props.initialize(initialValues);
    }, [props.classScheduleOne]);

    const setEndTime = (startTime) =>
        props.change(
            'endTime',
            moment(startTime, 'HH:mm').add(CLASS_DURATION, 'h').format('HH:mm'),
        );

    return (
        <Card class="form-card">
            <h2 className="form-title">
                {props.classScheduleOne.id ? t('edit_title') : t('create_title')}{' '}
                {t('class_y_label')}
            </h2>
            <form onSubmit={handleSubmit}>
                <Field
                    component={renderTextField}
                    className="form-field"
                    name="class_name"
                    id="class_name"
                    label={t('class_label')}
                    type="text"
                    validate={[required, uniqueClassName]}
                />
                <div className="form-time-block">
                    <Field
                        component={renderTimePicker}
                        className="time-input"
                        name="startTime"
                        label={t('class_from_label')}
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
                        label={t('class_to_label')}
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
                        {t('save_button_label')}
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
