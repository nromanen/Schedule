import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss'
import './addStudentDialog.scss'
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Card from '../../Card/Card';
import { Field, reduxForm } from 'redux-form';
import renderTextField from '../../renderedFields/input';
import { required } from '../../../validation/validateFields';
import { STUDENT_FORM, TEACHER_FORM } from '../../../constants/reduxForms';
import { FaWindowClose } from 'react-icons/fa';
import renderSelectField from '../../renderedFields/select';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { goToGroupPage } from '../../../helper/pageRedirection';
 let AddStudentDialog =( props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset,open,groups,student,match} = props;
    const studentId = student.id;
    const history =useHistory();
    useEffect(() => {
        if (studentId) {
            initializeFormHandler(student);
        } else {
            props.initialize();
        }
    },[studentId]);


    const initializeFormHandler = student => {
        props.initialize({
            id: student.id,
            surname: student.surname,
            name: student.name,
            patronymic: student.patronymic,
            email:student.email,
            group:student.group.id
        });
    };
    return (
        <Dialog
            disableBackdropClick={true}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            {console.log(student)}
            <FaWindowClose
                title={t('close_label')}
                className="close-dialog"
                variant="contained"
                onClick={() => {
                    //reset();
                    props.onSetSelectedCard(null);
                    goToGroupPage(history);
                }}

            />
            <DialogTitle id="confirm-dialog-title">
                <Card class="form-card teacher-form">

                    <form className="createTeacherForm w-100" onSubmit={handleSubmit}>

                        <h2 className="form-title">
                            {studentId ? t('edit_title') : t('create_title')}{' '}
                            {t('student_a_label')}
                        </h2>


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
                        {studentId?

                            <Field
                                className='form-field'
                                component={renderSelectField}
                                name='group'
                                label={t('type_label')}
                                validate={[required]}>
                                defaultValue={student.group.id}
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.title}
                                    </option>
                                ))}
                            </Field>
                            :null
                        }


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
                                   goToGroupPage(history);
                                    //props.onSetSelectedCard(null);
                                }}
                            >
                                {studentId?t('cancel_button_label'):t('clear_button_label')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </DialogTitle>
        </Dialog>
    );
};

AddStudentDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
    student: state.students.student,
    groups: state.groups.groups,
    group: state.groups.group,
});



AddStudentDialog = reduxForm({
    form: STUDENT_FORM
})(AddStudentDialog);
export default connect(mapStateToProps, {})(AddStudentDialog);
