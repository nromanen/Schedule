import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Field, reduxForm } from 'redux-form';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TEMPORARY_SCHEDULE_VACATION_FORM } from '../../../constants/reduxForms';
import renderMonthPicker from '../../../share/renderedFields/timeSemester';
import Card from '../../../share/Card/Card';

import { greaterThanDate, lessThanDate, required } from '../../../validation/validateFields';

import { handleTeacherInfo } from '../../../helper/renderTeacher';

import {
    selectTeacherIdService,
    selectVacationService,
} from '../../../services/temporaryScheduleService';
import renderCheckboxField from '../../../share/renderedFields/checkbox';
import {
    SAVE_BUTTON_LABEL,
    CLEAR_BUTTON_LABEL,
    CLASS_FROM_LABEL,
    CLASS_TO_LABEL,
    FORM_TEACHER_LABEL,
    COMMON_NOTIFY_LABEL,
    COMMON_FEW_DAYS_LABEL,
    COMMON_DATE_LABEL,
    FOR_ALL,
    FOR_TEACHER,
    EDIT_VACATION_FORM,
    CREATE_VACATION_FORM,
} from '../../../constants/translationLabels';

let TemporaryScheduleVacationForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, invalid, reset, submitting } = props;

    const [isFewDays, setIsFewDays] = useState(false);
    const [forAll, setForAll] = useState(true);
    const [notify, setNotify] = useState(false);

    const { teachers, teacherId } = props;

    const { vacation } = props;
    const vacationId = vacation.id;

    useEffect(() => {
        if (vacationId) {
            initializeFormHandler(vacation);
        } else {
            props.initialize();
        }
    }, [vacationId]);

    const initializeFormHandler = (vacation) => {
        if (vacation.teacher?.id) {
            selectTeacherIdService(vacation.teacher.id);
            setForAll(false);
        } else {
            setForAll(true);
        }
        props.initialize({
            id: vacation.id,
            date: vacation.date,
        });
    };

    const handleForAllChange = (event) => {
        setForAll(event.target.checked);
    };

    const handleChange = (event) => {
        setIsFewDays(event.target.checked);
    };

    const handleNotifyChange = (event) => setNotify(event.target.checked);

    const defaultProps = {
        options: teachers,
        getOptionLabel: (option) => (option ? handleTeacherInfo(option) : ''),
    };

    const handleFindTeacher = (teacherId) => {
        if (teacherId) return teachers.find((teacher) => teacher.id === teacherId);
        return '';
    };

    const handleTeacherSelect = (teacher) => {
        if (teacher) selectTeacherIdService(teacher.id);
    };

    useEffect(() => {
        if (teacherId) setForAll(false);
    }, [teacherId]);

    useEffect(() => {
        if (forAll) selectTeacherIdService(null);
    }, [forAll]);

    return (
        <Card class="form-card">
            <h2 className="form-title under-line">
                {vacationId ? t(EDIT_VACATION_FORM) : t(CREATE_VACATION_FORM)}
            </h2>
            <form onSubmit={handleSubmit}>
                <FormControlLabel
                    control={
                        <Checkbox checked={isFewDays} onChange={handleChange} color="primary" />
                    }
                    label={t(COMMON_FEW_DAYS_LABEL)}
                />
                {isFewDays ? (
                    <>
                        <Field
                            className="time-input"
                            name="from"
                            component={renderMonthPicker}
                            label={`${t(CLASS_FROM_LABEL)}:`}
                            validate={[required, lessThanDate]}
                        />
                        <Field
                            className="time-input"
                            name="to"
                            component={renderMonthPicker}
                            label={`${t(CLASS_TO_LABEL)}:`}
                            validate={[required, greaterThanDate]}
                        />
                    </>
                ) : (
                    <Field
                        className="time-input"
                        name="date"
                        component={renderMonthPicker}
                        label={`${t(COMMON_DATE_LABEL)}:`}
                        validate={[required]}
                    />
                )}
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                color="primary"
                                checked={forAll}
                                onChange={handleForAllChange}
                            />
                        }
                        label={forAll ? t(FOR_ALL) : t(FOR_TEACHER)}
                    />
                </div>
                {!forAll && (
                    <Autocomplete
                        {...defaultProps}
                        clearOnEscape
                        openOnFocus
                        value={handleFindTeacher(teacherId)}
                        onChange={(event, newValue) => {
                            if (!newValue) handleTeacherSelect({});
                            else handleTeacherSelect(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t(FORM_TEACHER_LABEL)}
                                margin="normal"
                            />
                        )}
                    />
                )}
                <Field
                    name="notify"
                    label={t(COMMON_NOTIFY_LABEL)}
                    component={renderCheckboxField}
                    checked={notify}
                    onChange={handleNotifyChange}
                    color="primary"
                />

                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={submitting || invalid}
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        type="button"
                        variant="contained"
                        disabled={submitting || invalid}
                        onClick={() => {
                            reset();
                            selectVacationService({});
                        }}
                    >
                        {t(CLEAR_BUTTON_LABEL)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

TemporaryScheduleVacationForm = reduxForm({
    form: TEMPORARY_SCHEDULE_VACATION_FORM,
})(TemporaryScheduleVacationForm);

export default TemporaryScheduleVacationForm;
