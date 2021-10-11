import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import renderTextField from '../../share/renderedFields/input';
import { required } from '../../validation/validateFields';

import Card from '../../share/Card/Card';

import { TEACHER_FORM } from '../../constants/reduxForms';

import './AddTeacherForm.scss';
import { ReduxFormSelect } from '../../helper/ReduxFormSelect';
import renderSelectField from '../../share/renderedFields/select';
import { getDepartmentByIdService } from '../../services/departmentService';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    TEACHER_A_LABEL,
    TEACHER_SURNAME,
    TEACHER_FIRST_NAME,
    TEACHER_PATRONYMIC,
    TEACHER_POSITION,
    EMAIL_FIELD,
    DEPARTMENT_TEACHER_LABEL,
} from '../../constants/translationLabels';

let AddTeacher = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset, departments, teacher } = props;

    const teacherId = teacher.id;

    useEffect(() => {
        if (teacherId) {
            initializeFormHandler(teacher);
        } else {
            props.initialize();
        }
    }, [teacherId]);

    const initializeFormHandler = (teacher) => {
        const department = teacher.department ? teacher.department.id : 0;
        props.initialize({
            id: teacher.id,
            surname: teacher.surname,
            name: teacher.name,
            patronymic: teacher.patronymic,
            position: teacher.position,
            email: teacher.email,
            department,
        });
        teacher.department && getDepartmentByIdService(teacher.department.id);
    };

    return (
        <Card class="form-card teacher-form">
            <form className="createTeacherForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {teacherId ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(TEACHER_A_LABEL)}
                </h2>

                <Field
                    className="form-field"
                    name="surname"
                    id="surname"
                    component={renderTextField}
                    type="text"
                    placeholder={t(TEACHER_SURNAME)}
                    label={t(TEACHER_SURNAME)}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="name"
                    id="name"
                    component={renderTextField}
                    type="text"
                    placeholder={t(TEACHER_FIRST_NAME)}
                    label={t(TEACHER_FIRST_NAME)}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="patronymic"
                    id="patronymic"
                    component={renderTextField}
                    type="text"
                    placeholder={t(TEACHER_PATRONYMIC)}
                    label={t(TEACHER_PATRONYMIC)}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="position"
                    id="position"
                    component={renderTextField}
                    type="text"
                    placeholder={t(TEACHER_POSITION)}
                    label={t(TEACHER_POSITION)}
                    validate={[required]}
                />
                <Field
                    className="form-field"
                    name="email"
                    id="email"
                    component={renderTextField}
                    type="email"
                    placeholder={t(EMAIL_FIELD)}
                    label={t(EMAIL_FIELD)}
                />
                <Field
                    name="department"
                    className="week-days"
                    component={renderSelectField}
                    label={t(DEPARTMENT_TEACHER_LABEL)}
                    type="text"
                    onChange={({ target }) => {
                        getDepartmentByIdService(target.value);
                    }}
                >
                    <option />
                    {departments.map((item) => (
                        <option key={item.id} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </Field>

                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        variant="contained"
                        disabled={setDisableButton(pristine, submitting, teacher.id)}
                        onClick={() => {
                            reset();
                            props.onSetSelectedCard(null);
                        }}
                    >
                        {getClearOrCancelTitle(teacher.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({ teacher: state.teachers.teacher });

AddTeacher = reduxForm({
    form: TEACHER_FORM,
})(AddTeacher);

export default connect(mapStateToProps)(AddTeacher);
