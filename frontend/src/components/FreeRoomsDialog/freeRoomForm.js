import React, { useEffect, useState } from 'react';
import { reduxForm, Field, change, untouch } from 'redux-form';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import { required } from '../../validation/validateFields';
import SelectField from '../../share/renderedFields/select';
import { FREE_ROOMS } from '../../constants/reduxForms';
import './FreeRoomsDialog.scss';
import {
    FORM_SEMESTER_FREE_ROOMS,
    FORM_WEEK_FREE_ROOMS,
    FORM_DAY_FREE_ROOMS,
    FORM_CLASS_FREE_ROOMS,
    FORM_SUBMIT_BUTTON_LABEL,
} from '../../constants/translationLabels/formElements';
import { getAllSemestersStart } from '../../actions/semesters';
import { getFreeRoomsStart } from '../../actions/rooms';

const FreeRoomForm = (props) => {
    const {
        handleSubmit,
        getAllSemestersItems,
        getFreeRoomsByParams,
        pristine,
        submitting,
        semesters,
        clearField,
        initialValues,
    } = props;
    const [semesterClasses, setSemesterClasses] = useState([]);
    const [semesterDays, setSemesterDays] = useState([]);
    const { t } = useTranslation('formElements');

    const weeks = ['ODD', 'EVEN', 'WEEKLY'];

    const getFormDataBySemesterId = (id) => {
        const semesterData = semesters.find((item) => item.id === id);
        setSemesterDays(semesterData?.semester_days.map((item) => item.toUpperCase()) || []);
        setSemesterClasses(semesterData?.semester_classes || []);
        clearField('classId');
        clearField('dayOfWeek');
    };

    useEffect(() => {
        getAllSemestersItems();
    }, []);
    useEffect(() => {
        if (!isNil(semesters)) {
            getFormDataBySemesterId(initialValues.semesterId);
        }
    }, [semesters]);

    const searchFreeRooms = (values) => {
        getFreeRoomsByParams(values);
    };

    return (
        <>
            <form className="free-room-form" onSubmit={handleSubmit(searchFreeRooms)}>
                <Field
                    name="semesterId"
                    component={SelectField}
                    label={t(FORM_SEMESTER_FREE_ROOMS)}
                    onChange={({ target }) => getFormDataBySemesterId(target.value)}
                    type="text"
                    className="form-select"
                    validate={[required]}
                >
                    {semesters.map((semester) => (
                        <MenuItem key={semester.id} value={semester.id}>
                            {semester.description}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    name="evenOdd"
                    component={SelectField}
                    label={t(FORM_WEEK_FREE_ROOMS)}
                    type="text"
                    className="form-select"
                    validate={[required]}
                >
                    <MenuItem value=""></MenuItem>
                    {weeks.map((week) => (
                        <MenuItem key={week} value={`${week}`}>
                            {t(`common:${week.toLowerCase()}_week`)}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    name="dayOfWeek"
                    component={SelectField}
                    label={t(FORM_DAY_FREE_ROOMS)}
                    type="text"
                    className="form-select"
                    validate={[required]}
                >
                    <MenuItem value=""></MenuItem>
                    {semesterDays.map((day) => (
                        <MenuItem key={day} value={`${day}`}>
                            {t(`common:day_of_week_${day}`)}
                        </MenuItem>
                    ))}
                </Field>
                <Field
                    name="classId"
                    component={SelectField}
                    label={t(FORM_CLASS_FREE_ROOMS)}
                    type="text"
                    className="form-select"
                    displayEmpty
                    validate={[required]}
                >
                    <MenuItem value=""></MenuItem>
                    {semesterClasses.map((item) => {
                        const classTitle = item.class_name;
                        return (
                            <MenuItem key={classTitle} value={`${classTitle}`}>
                                {classTitle}
                            </MenuItem>
                        );
                    })}
                </Field>
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
                </div>
            </form>
        </>
    );
};

const mapStateToProps = (state) => ({
    initialValues: { semesterId: state.schedule.currentSemester.id },
    freeRooms: state.rooms.freeRooms,
    semesters: state.semesters.semesters,
});
const mapDispatchToProps = (dispatch) => ({
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
    getFreeRoomsByParams: (params) => dispatch(getFreeRoomsStart(params)),
    clearField: (fieldName) => {
        dispatch(change(FREE_ROOMS, fieldName));
        dispatch(untouch(FREE_ROOMS, fieldName));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: FREE_ROOMS,
        enableReinitialize: true,
    })(FreeRoomForm),
);
