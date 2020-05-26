import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import renderTextField from '../../share/renderedFields/input';
import { required } from '../../validation/validateFields';

import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

import Card from '../../share/Card/Card';

import { TEACHER_FORM } from '../../constants/reduxForms';
import { useTranslation } from 'react-i18next';

import './AddTeacherForm.scss';

const CreateBtn = styled(Button)({
    marginTop: '20px'
});

let AddTeacher = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset } = props;

    const teacher = props.teacher;
    const teacherId = teacher.id;

    useEffect(() => {
        if (teacherId) {
            initializeFormHandler(teacher);
        } else {
            props.initialize();
        }
    }, [teacherId]);

    const initializeFormHandler = teacher => {
        props.initialize({
            id: teacher.id,
            surname: teacher.surname,
            name: teacher.name,
            patronymic: teacher.patronymic,
            position: teacher.position
        });
    };

    return (
        <Card class="form-card teacher-form">
            <form className="createTeacherForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {teacherId ? t('edit_title') : t('create_title')}{' '}
                    {t('teacher_a_label')}
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

                <div className="form-buttons-container">
                    <CreateBtn
                        className="buttons-style"
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t('save_button_label')}
                    </CreateBtn>
                    <CreateBtn
                        className="buttons-style"
                        variant="contained"
                        disabled={pristine || submitting}
                        onClick={() => {
                            reset();
                            props.onSetSelectedCard(null);
                        }}
                    >
                        {t('clear_button_label')}
                    </CreateBtn>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = state => ({ teacher: state.teachers.teacher });

AddTeacher = reduxForm({
    form: TEACHER_FORM
})(AddTeacher);

export default connect(mapStateToProps)(AddTeacher);