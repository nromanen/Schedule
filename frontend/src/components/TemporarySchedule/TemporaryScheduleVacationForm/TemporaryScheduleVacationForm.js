import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../../share/Card/Card';
import renderMonthPicker from '../../../share/renderedFields/timeSemester';

import { Field, reduxForm } from 'redux-form';

import { TEMPORARY_SCHEDULE_VACATION_FORM } from '../../../constants/reduxForms';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

import {
    greaterThanDate,
    lessThanDate,
    required
} from '../../../validation/validateFields';
import Switch from '@material-ui/core/Switch';
import { handleTeacherInfo } from '../../../helper/handleTeacherInfo';
import { selectTeacherIdService } from '../../../services/temporaryScheduleService';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

let TemporaryScheduleVacationForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, reset, submitting } = props;

    const [isFewDays, setIsFewDays] = useState(false);
    const [forAll, setForAll] = useState(true);

    const { teachers, teacherId } = props;

    const handleForAllChange = event => {
        setForAll(event.target.checked);
    };

    const handleChange = event => {
        setIsFewDays(event.target.checked);
    };

    const defaultProps = {
        options: teachers,
        getOptionLabel: option => (option ? handleTeacherInfo(option) : '')
    };

    const handleFindTeacher = teacherId => {
        if (teacherId)
            return teachers.find(teacher => teacher.id === teacherId);
        else return '';
    };

    const handleTeacherSelect = teacher => {
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
            <form onSubmit={handleSubmit}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isFewDays}
                            onChange={handleChange}
                            color="primary"
                        />
                    }
                    label={t('common:few_days_label')}
                />
                {isFewDays ? (
                    <>
                        <Field
                            className="time-input"
                            name="startDay"
                            component={renderMonthPicker}
                            label={t('class_from_label') + ':'}
                            validate={[required, lessThanDate]}
                        />
                        <Field
                            className="time-input"
                            name="endDay"
                            component={renderMonthPicker}
                            label={t('class_to_label') + ':'}
                            validate={[required, greaterThanDate]}
                        />{' '}
                    </>
                ) : (
                    <Field
                        className="time-input"
                        name="date"
                        component={renderMonthPicker}
                        label={t('class_to_label') + ':'}
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
                        label={forAll ? 'For all' : 'For teacher'}
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
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={t('formElements:teacher_label')}
                                margin="normal"
                            />
                        )}
                    />
                )}

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
                        disabled={pristine || submitting}
                        onClick={() => {
                            reset();
                        }}
                    >
                        {t('clear_button_label')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

TemporaryScheduleVacationForm = reduxForm({
    form: TEMPORARY_SCHEDULE_VACATION_FORM
})(TemporaryScheduleVacationForm);

export default TemporaryScheduleVacationForm;
