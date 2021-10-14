import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import renderTextField from '../../share/renderedFields/input';
import { required } from '../../validation/validateFields';

import Card from '../../share/Card/Card';

import { TEACHER_FORM } from '../../constants/reduxForms';

import './AddTeacherForm.scss';
import SelectField from '../../share/renderedFields/select';
import { getDepartmentByIdService } from '../../services/departmentService';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';

let AddTeacher = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset, departments, teacher } = props;

    const teacherId = teacher.id;

    const initializeFormHandler = (teacherData) => {
        const department = teacherData.department ? teacherData.department.id : 0;
        props.initialize({
            id: teacherData.id,
            surname: teacherData.surname,
            name: teacherData.name,
            patronymic: teacherData.patronymic,
            position: teacherData.position,
            email: teacherData.email,
            department,
        });
        if (teacherData.department) getDepartmentByIdService(teacherData.department.id);
    };

    useEffect(() => {
        if (teacherId) {
            initializeFormHandler(teacher);
        } else {
            props.initialize();
        }
    }, [teacherId]);

    return (
        <Card additionClassName="form-card teacher-form">
            <form className="createTeacherForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {teacherId ? t('edit_title') : t('create_title')} {t('teacher_a_label')}
                </h2>

                <Field
                    className="form-field"
                    name="surname"
                    id="surname"
                    component={renderTextField}
                    type="text"
                    placeholder={t('teacher_surname')}
                    label={t('teacher_surname')}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="name"
                    id="name"
                    component={renderTextField}
                    type="text"
                    placeholder={t('teacher_first_name')}
                    label={t('teacher_first_name')}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="patronymic"
                    id="patronymic"
                    component={renderTextField}
                    type="text"
                    placeholder={t('teacher_patronymic')}
                    label={t('teacher_patronymic')}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="position"
                    id="position"
                    component={renderTextField}
                    type="text"
                    placeholder={t('teacher_position')}
                    label={t('teacher_position')}
                    validate={[required]}
                />
                <Field
                    className="form-field"
                    name="email"
                    id="email"
                    component={renderTextField}
                    type="email"
                    placeholder={t('email_field')}
                    label={t('email_field')}
                />
                <Field
                    name="department"
                    className="week-days"
                    component={SelectField}
                    label={t('department_teachers_label')}
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
                        {t('save_button_label')}
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
