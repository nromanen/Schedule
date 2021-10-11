import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import '../dialog.scss';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Card from '../../Card/Card';
import renderTextField from '../../renderedFields/input';
import { required } from '../../../validation/validateFields';
import { STUDENT_FORM } from '../../../constants/reduxForms';
import renderSelectField from '../../renderedFields/select';
import { goToGroupPage } from '../../../helper/pageRedirection';
import CustomDialog from '../CustomDialog';

const AddStudentDialog = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, onSetSelectedCard, pristine, submitting, reset, open, groups, student } =
        props;
    const studentId = student.id;
    const history = useHistory();

    const initializeFormHandler = (currentStudent) => {
        const { id, surname, name, patronymic, email, group } = currentStudent;
        props.initialize({
            id,
            surname,
            name,
            patronymic,
            email,
            group: group.id,
        });
    };
    const handleClose = () => {
        onSetSelectedCard(null);
        goToGroupPage(history);
    };

    useEffect(() => {
        if (studentId) {
            initializeFormHandler(student);
        } else {
            props.initialize();
        }
    }, [studentId]);

    return (
        <CustomDialog
            title={studentId ? t('edit_title') : `${t('create_title')} ${t('student_a_label')}`}
            open={open}
            onClose={handleClose}
            buttons={
                <Button
                    className="buttons-style"
                    variant="contained"
                    disabled={pristine || submitting}
                    onClick={() => {
                        handleClose();
                    }}
                >
                    {t('cancel_button_label')}
                </Button>
            }
        >
            <Card class="form-card teacher-form">
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
                            label={t('type_label')}
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
                            onClick={() => {
                                reset();
                            }}
                        >
                            {studentId ? t('cancel_button_label') : t('clear_button_label')}
                        </Button>
                    </div>
                </form>
            </Card>
        </CustomDialog>
    );
};

AddStudentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
    student: state.students.student,
    groups: state.groups.groups,
    group: state.groups.group,
});

const AddStudentDialogForm = reduxForm({
    form: STUDENT_FORM,
})(AddStudentDialog);
export default connect(mapStateToProps, {})(AddStudentDialogForm);
