import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import renderTextField from '../../../share/renderedFields/input';
import { emailValidation, required } from '../../../validation/validateFields';
import Card from '../../../share/Card/Card';
import { TEACHER_FORM } from '../../../constants/reduxForms';
import './AddTeacherForm.scss';
import SelectField from '../../../share/renderedFields/select';
import { getDepartmentByIdService } from '../../../services/departmentService';
import { getClearOrCancelTitle, setDisableButton } from '../../../helper/disableComponent';
import {
    CREATE_TITLE,
    DEPARTMENT_TEACHER_LABEL,
    EDIT_TITLE,
    EMAIL_FIELD,
    SAVE_BUTTON_LABEL,
    TEACHER_A_LABEL,
    TEACHER_FIRST_NAME,
    TEACHER_PATRONYMIC,
    TEACHER_POSITION,
    TEACHER_SURNAME,
} from '../../../constants/translationLabels/formElements';
import TextFormField from '../../Fields/TextFormField';
import { academicTitle } from '../../../constants/academicTitle';

const AddTeacherForm = (props) => {
    const {
        i18n: { language },
    } = useTranslation();
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset, departments, teacher, initialize, valid } =
        props;

    const teacherId = teacher.id;
    const [isCustom, setIsCustom] = useState(false);

    const initializeFormHandler = (teacherData) => {
        const department = teacherData.department ? teacherData.department.id : 0;
        const { id, surname, name, patronymic, position, email } = teacherData;
        initialize({
            id,
            surname,
            name,
            patronymic,
            position,
            email,
            department,
        });
        if (teacherData.department) getDepartmentByIdService(teacherData.department.id);
    };

    useEffect(() => {
        if (teacherId) {
            initializeFormHandler(teacher);
        } else {
            initialize();
        }
    }, [teacherId]);

    return (
        <Card additionClassName="form-card teacher-form">
            <form className="createTeacherForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {teacherId ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(TEACHER_A_LABEL)}
                </h2>
                <TextFormField
                    name="surname"
                    id="surname"
                    type="text"
                    placeholder={t(TEACHER_SURNAME)}
                    label={t(TEACHER_SURNAME)}
                    validate={[required]}
                />
                <TextFormField
                    name="name"
                    id="name"
                    type="text"
                    placeholder={t(TEACHER_FIRST_NAME)}
                    label={t(TEACHER_FIRST_NAME)}
                    validate={[required]}
                />
                <TextFormField
                    name="patronymic"
                    id="patronymic"
                    type="text"
                    placeholder={t(TEACHER_PATRONYMIC)}
                    label={t(TEACHER_PATRONYMIC)}
                    validate={[required]}
                />
                {!isCustom && (
                    <Field
                        name="position"
                        component="select"
                        onChange={(_, v) => {
                            if (v === 'custom') {
                                setIsCustom(true);
                            }
                        }}
                        normalize={(value) => {
                            if (value === 'custom') {
                                setIsCustom(true);
                                return '';
                            }
                            return value;
                        }}
                        validate={[required]}
                    >
                        <option />
                        {academicTitle.map((title, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <option key={index} value={title[language]}>
                                {title[language]}
                            </option>
                        ))}
                    </Field>
                )}
                {isCustom && (
                    <>
                        <TextFormField
                            name="position"
                            id="position"
                            type="text"
                            placeholder={t(TEACHER_POSITION)}
                            label={t(TEACHER_POSITION)}
                            validate={[required]}
                        />
                        <Button
                            className="buttons-style"
                            variant="contained"
                            onClick={() => {
                                setIsCustom(false);
                            }}
                        >
                            Вибрати із списку
                        </Button>
                    </>
                )}
                <Field
                    className="form-field"
                    name="email"
                    id="email"
                    component={renderTextField}
                    type="email"
                    placeholder={t(EMAIL_FIELD)}
                    label={t(EMAIL_FIELD)}
                    validate={emailValidation}
                />
                <Field
                    name="department"
                    className="week-days"
                    component={SelectField}
                    label={t(DEPARTMENT_TEACHER_LABEL)}
                    type="text"
                    onChange={({ target }) => {
                        getDepartmentByIdService(target.value);
                    }}
                >
                    <MenuItem value="" className="hidden" disabled />
                    {departments.map((item) => (
                        <MenuItem key={item.id} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Field>

                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting || !valid}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        variant="contained"
                        disabled={setDisableButton(pristine, submitting, teacher.id) || !valid}
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

export default reduxForm({
    form: TEACHER_FORM,
})(AddTeacherForm);
