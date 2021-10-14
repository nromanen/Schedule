import React, { useEffect } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { required } from '../../validation/validateFields';
import SelectField from '../../share/renderedFields/select';
import { FREE_ROOMS } from '../../constants/reduxForms';
import { showAllSemestersService } from '../../services/semesterService';
import './freeRoomForm.scss';
import { daysUppercase } from '../../constants/schedule/days';

let FreeRoomForm = (props) => {
    const { t } = useTranslation('formElements');

    const weeks = ['ODD', 'EVEN', 'WEEKLY'];

    useEffect(() => showAllSemestersService(), []);

    const { handleSubmit, classScheduler, pristine, submitting, onReset, semesters } = props;

    const classNames = [];

    if (classScheduler.length - 1 > 0) {
        classScheduler.map((classSchedulerOne) => classNames.push(classSchedulerOne.class_name));
    }

    return (
        <>
            <form className="freeRoomsItems" onSubmit={handleSubmit}>
                <div className="roomsItems">
                    <Field
                        name="semesterId"
                        component={SelectField}
                        label={t('formElements:semester_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value=""></option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.description}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="evenOdd"
                        component={SelectField}
                        label={t('formElements:week_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value=""></option>
                        {weeks.map((week) => (
                            <option key={week} value={`${week}`}>
                                {t(`common:${week.toLowerCase()}_week`)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="dayOfWeek"
                        component={SelectField}
                        label={t('formElements:day_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value=""></option>
                        {daysUppercase.map((day) => (
                            <option key={day} value={`${day}`}>
                                {t(`common:day_of_week_${day}`)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="class"
                        component={SelectField}
                        label={t('formElements:class_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value=""></option>
                        {classNames.map((classNum) => (
                            <option key={classNum} value={`${classNum}`}>
                                {classNum}
                            </option>
                        ))}
                    </Field>
                </div>
                <div className="form-buttons-container freeRoomsButtons">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        className="buttons-style"
                        type="submit"
                    >
                        {t('formElements:submit_button_label')}
                    </Button>
                    <Button
                        variant="contained"
                        disabled={pristine || submitting}
                        className="buttons-style"
                        onClick={onReset}
                    >
                        {t('formElements:clear_button_label')}
                    </Button>
                </div>
            </form>
        </>
    );
};

const mapStateToProps = (state) => ({
    freeRooms: state.freeRooms.freeRooms,
    semesters: state.semesters.semesters,
});

FreeRoomForm = reduxForm({
    form: FREE_ROOMS,
})(FreeRoomForm);

export default connect(mapStateToProps)(FreeRoomForm);
