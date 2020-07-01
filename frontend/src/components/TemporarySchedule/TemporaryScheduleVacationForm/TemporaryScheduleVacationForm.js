import React, { useState } from 'react';
import Card from '../../../share/Card/Card';

import { Field, reduxForm } from 'redux-form';

import { TEMPORARY_SCHEDULE_VACATION_FORM } from '../../../constants/reduxForms';
import Checkbox from '@material-ui/core/Checkbox';
import renderMonthPicker from '../../../share/renderedFields/timeSemester';
import {
    greaterThanDate,
    lessThanDate,
    required
} from '../../../validation/validateFields';
import { useTranslation } from 'react-i18next';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

let TemporaryScheduleVacationForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, reset, submitting } = props;

    const [isFewDays, setIsFewDays] = useState(false);

    const handleChange = event => {
        setIsFewDays(event.target.checked);
    };

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
                        name="day"
                        component={renderMonthPicker}
                        label={t('class_to_label') + ':'}
                        validate={[required]}
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
