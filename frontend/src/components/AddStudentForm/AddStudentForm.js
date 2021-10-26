import Button from '@material-ui/core/Button';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import Card from '../../share/Card/Card';
import { required } from '../../validation/validateFields';
import renderTextField from '../../share/renderedFields/input';
import renderSelectField from '../../share/renderedFields/select';
import { TYPE_LABEL } from '../../constants/translationLabels/common';

export const AddStudentForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, submitting, initialize, pristine, student, groups, reset } = props;
    const studentId = student.id;

    const initializeFormHandler = (currentStudent) => {
        const { id, surname, name, patronymic, email, group } = currentStudent;
        initialize({
            id,
            surname,
            name,
            patronymic,
            email,
            group: group.id,
        });
    };

    useEffect(() => {
        if (studentId) {
            initializeFormHandler(student);
        } else {
            initialize();
        }
    }, [studentId]);

    return (
        <Card additionClassName="form-card teacher-form">
            <form className="createTeacherForm w-100" onSubmit={handleSubmit}>
                <Field
                    className="form-field"
                    name="surname"
                    id="surname"
                    component={renderTextField}
                    type="text"
                    placeholder={t('surname_placeholder')}
                    label={t('surname_placeholder')}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="name"
                    id="name"
                    component={renderTextField}
                    type="text"
                    placeholder={t('name_placeholder')}
                    label={t('name_placeholder')}
                    validate={[required]}
                />

                <Field
                    className="form-field"
                    name="patronymic"
                    id="patronymic"
                    component={renderTextField}
                    type="text"
                    placeholder={t('patronymic_placeholder')}
                    label={t('patronymic_placeholder')}
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
                    validate={[required]}
                />
                {studentId && (
                    <Field
                        className="form-field"
                        component={renderSelectField}
                        name="group"
                        label={t(TYPE_LABEL)}
                        validate={[required]}
                    >
                        defaultValue={student.group.id}
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.title}
                            </option>
                        ))}
                    </Field>
                )}

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
                        disabled={pristine || submitting}
                        onClick={reset}
                    >
                        {studentId ? t('cancel_button_label') : t('clear_button_label')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};
