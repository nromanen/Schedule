import React, { useEffect } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { required } from '../../validation/validateFields';
import renderSelectField from '../../share/renderedFields/select';
import { FREE_ROOMS } from '../../constants/reduxForms';
import { useTranslation } from 'react-i18next';
import { showAllSemestersService } from '../../services/semesterService';
import './freeRoomForm.scss';
import { daysUppercase } from '../../constants/schedule/days';

let FreeRoomForm = props => {

    const { t } = useTranslation('formElements');

    const weeks = ['ODD', 'EVEN', 'WEEKLY'];

    useEffect(() => showAllSemestersService(), []);

    const {
        handleSubmit,
        classScheduler,
        pristine,
        submitting,
        onReset
    } = props;

    const class_names = [];

    if (classScheduler.length - 1 > 0) {
        classScheduler.map(classSchedulerOne => {
            class_names.push(classSchedulerOne.class_name);
        });
    }

    return (
        <>
            <form className="freeRoomsItems" onSubmit={handleSubmit}>
                <div className="roomsItems">
                    <Field
                        name="semesterId"
                        component={renderSelectField}
                        label={t('formElements:semester_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value={''}></option>
                        {props.semesters.map((semesters, index) => (
                            <option key={index} value={semesters.id}>
                                {semesters.description}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="evenOdd"
                        component={renderSelectField}
                        label={t('formElements:week_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value={''}></option>
                        {weeks.map((week, index) => (
                            <option key={index} value={`${week}`}>
                                {t(`common:${week.toLowerCase()}_week`)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="dayOfWeek"
                        component={renderSelectField}
                        label={t('formElements:day_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value={''}></option>
                        {daysUppercase.map((day, index) => (
                            <option key={index} value={`${day}`}>
                                {t(`common:day_of_week_${day}`)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        name="class"
                        component={renderSelectField}
                        label={t('formElements:class_free_rooms')}
                        type="text"
                        className="freeRoomsItem"
                        validate={[required]}
                    >
                        <option value={''}></option>
                        {class_names.map((classNum, index) => (
                            <option key={index} value={`${classNum}`}>
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

const mapStateToProps = state => ({
    freeRooms: state.freeRooms.freeRooms,
    semesters: state.semesters.semesters
});

FreeRoomForm = reduxForm({
    form: FREE_ROOMS
})(FreeRoomForm);

export default connect(mapStateToProps)(FreeRoomForm);
