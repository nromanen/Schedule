import React, { useEffect } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { required } from '../../validation/validateFields';
import SelectField from '../../share/renderedFields/select';
import { FREE_ROOMS } from '../../constants/reduxForms';
import './freeRoomForm.scss';
import { daysUppercase } from '../../constants/schedule/days';
import {
    FORM_SEMESTER_FREE_ROOMS,
    FORM_WEEK_FREE_ROOMS,
    FORM_DAY_FREE_ROOMS,
    FORM_CLASS_FREE_ROOMS,
    FORM_SUBMIT_BUTTON_LABEL,
    FORM_CLEAR_BUTTON_LABEL,
} from '../../constants/translationLabels/formElements';
import { getAllSemestersStart } from '../../actions/semesters';

let FreeRoomForm = (props) => {
    const { getAllSemestersItems } = props;
    const { t } = useTranslation('formElements');

    const weeks = ['ODD', 'EVEN', 'WEEKLY'];

    useEffect(() => {
        getAllSemestersItems();
    }, []);

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
                        label={t(FORM_SEMESTER_FREE_ROOMS)}
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
                        label={t(FORM_WEEK_FREE_ROOMS)}
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
                        label={t(FORM_DAY_FREE_ROOMS)}
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
                        label={t(FORM_CLASS_FREE_ROOMS)}
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
                        {t(FORM_SUBMIT_BUTTON_LABEL)}
                    </Button>
                    <Button
                        variant="contained"
                        disabled={pristine || submitting}
                        className="buttons-style"
                        onClick={onReset}
                    >
                        {t(FORM_CLEAR_BUTTON_LABEL)}
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
const mapDispatchToProps = (dispatch) => ({
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
});
FreeRoomForm = reduxForm({
    form: FREE_ROOMS,
})(FreeRoomForm);

export default connect(mapStateToProps, mapDispatchToProps)(FreeRoomForm);
