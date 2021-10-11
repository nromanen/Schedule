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

const TemporaryScheduleVacationForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, invalid, reset, submitting } = props;

    const [isFewDays, setIsFewDays] = useState(false);
    const [forAll, setForAll] = useState(true);
    const [notify, setNotify] = useState(false);

    const { teachers, teacherId } = props;

    const { vacation } = props;
    const vacationId = vacation.id;

    const initializeFormHandler = (vacationData) => {
        if (vacationData.teacher?.id) {
            selectTeacherIdService(vacationData.teacher.id);
            setForAll(false);
        } else {
            setForAll(true);
        }
        props.initialize({
            id: vacationData.id,
            date: vacationData.date,
        });
    };

    useEffect(() => {
        if (vacationId) {
            initializeFormHandler(vacation);
        } else {
            props.initialize();
        }
    }, [vacationId]);

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

    const handleFindTeacher = (id) => {
        if (id) return teachers.find((teacher) => teacher.id === id);
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
        <Card additionClassName="form-card">
            <h2 className="form-title under-line">
                {vacationId ? t('edit_vacation_form') : t('create_vacation_form')}
            </h2>
            <form onSubmit={handleSubmit}>
                <FormControlLabel
                    control={
                        <Checkbox checked={isFewDays} onChange={handleChange} color="primary" />
                    }
                    label={t('common:few_days_label')}
                />
                {isFewDays ? (
                    <>
                        <Field
                            className="time-input"
                            name="from"
                            component={renderMonthPicker}
                            label={`${t('class_from_label')}:`}
                            validate={[required, lessThanDate]}
                        />
                        <Field
                            className="time-input"
                            name="to"
                            component={renderMonthPicker}
                            label={`${t('class_to_label')}:`}
                            validate={[required, greaterThanDate]}
                        />
                    </>
                ) : (
                    <Field
                        className="time-input"
                        name="date"
                        component={renderMonthPicker}
                        label={`${t('common:date')}:`}
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
                        label={forAll ? t('for_all') : t('for_teacher')}
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
                                label={t('formElements:teacher_label')}
                                margin="normal"
                            />
                        )}
                    />
                )}
                <Field
                    name="notify"
                    label={t('common:notify_label')}
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
                        {t('save_button_label')}
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
                        {t('clear_button_label')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const TemporaryScheduleVacationReduxForm = reduxForm({
    form: TEMPORARY_SCHEDULE_VACATION_FORM,
})(TemporaryScheduleVacationForm);

export default TemporaryScheduleVacationReduxForm;
