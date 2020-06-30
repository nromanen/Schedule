import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';

import { TEMPORARY_SCHEDULE_FORM } from '../../../constants/reduxForms';

import Button from '@material-ui/core/Button';

import Card from '../../../share/Card/Card';
import renderCheckboxField from '../../../share/renderedFields/checkbox';
import renderSelectField from '../../../share/renderedFields/select';
import { handleTeacherInfo } from '../../../helper/handleTeacherInfo';

let TemporaryScheduleForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, reset, submitting } = props;
    const [isVacation, setIsVacation] = useState(true);

    const temporarySchedule = props.temporarySchedule;
    const temporaryScheduleId = temporarySchedule?.id;

    const teacherId = props.teacherId;

    const { teachers, lessons, periods, rooms } = props;

    useEffect(() => {
        if (temporaryScheduleId) {
            initializeFormHandler(temporarySchedule);
        } else {
            props.initialize({ vacation: isVacation });
        }
    }, [temporaryScheduleId]);

    const initializeFormHandler = temporarySchedule => {
        props.initialize({ vacation: isVacation });
    };

    const handleVacationChange = event => setIsVacation(event.target.checked);

    return (
        <Card class="form-card">
            {teacherId ? (
                <>
                    <h2 className="form-title under-line">
                        {temporaryScheduleId
                            ? t('edit_title')
                            : t('create_title')}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <Field
                            name="vacation"
                            label={t('common:holiday_label')}
                            component={renderCheckboxField}
                            checked={isVacation}
                            onChange={handleVacationChange}
                            color="primary"
                        />
                        {!isVacation && (
                            <>
                                <Field
                                    name="lesson"
                                    className="form-field"
                                    component={renderSelectField}
                                    label={t('lesson_label')}
                                >
                                    <option value={''} />
                                </Field>
                                <Field
                                    name="teacher"
                                    className="form-field"
                                    component={renderSelectField}
                                    label={t('teacher_label')}
                                >
                                    <option value={''} />
                                    {teachers.map(teacher => (
                                        <option value={teacher.id}>
                                            {handleTeacherInfo(teacher)}
                                        </option>
                                    ))}
                                </Field>
                                <Field
                                    name="room"
                                    className="form-field"
                                    component={renderSelectField}
                                    label={t('room_label')}
                                >
                                    <option value={''} />
                                    {rooms.map(room => (
                                        <option value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </Field>
                                <Field
                                    name="period"
                                    className="form-field"
                                    component={renderSelectField}
                                    label={t('class_label')}
                                >
                                    <option value={''} />
                                    {periods.map(period => (
                                        <option value={period.id}>
                                            {period.startTime} - {period.endTime}
                                        </option>
                                    ))}
                                </Field>
                            </>
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
                </>
            ) : (
                <>
                    <h2 className="form-title under-line">
                        {t('create_vacation_title')}
                    </h2>
                    <form onSubmit={handleSubmit}>
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
                </>
            )}
        </Card>
    );
};

TemporaryScheduleForm = reduxForm({
    form: TEMPORARY_SCHEDULE_FORM
})(TemporaryScheduleForm);

export default TemporaryScheduleForm;
