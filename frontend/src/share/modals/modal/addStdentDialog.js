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
export let AddStudentDialog = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset,open} = props;
    const student={
        // id: 6,
        // name: "Nastia",
        // surname: "Gerasymchuk",
        // patronymic: "Borisovna",
        // email: "nasta7_2000@i.ua",
        // user_id: 0,
        // group: {
        //     id: 5,
        //     title: null,
        //     disable: false
        // }
    };
    const studentId = student.id;

    useEffect(() => {
        if (studentId) {
            initializeFormHandler(student);
        } else {
            props.initialize();
        }
    }, [studentId]);

    const initializeFormHandler = student => {
        props.initialize({
            id: student.id,
            surname: student.surname,
            name: student.name,
            patronymic: student.patronymic,
            email:student.email,
        });
    };
    return (
        <Dialog
            disableBackdropClick={true}
            // onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <FaWindowClose
                title={t('close_label')}
                className="close-dialog"
                variant="contained"
                onClick={() => {
                    //reset();
                    props.onSetSelectedCard(null);
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
                                    props.onSetSelectedCard(null);
                                }}
                            >
                                {t('clear_button_label')}
                            </Button>
                            {/*<Button*/}
                            {/*    className="buttons-style"*/}
                            {/*    variant="contained"*/}
                            {/*    onClick={() => {*/}
                            {/*        //reset();*/}
                            {/*        props.onSetSelectedCard(null);*/}
                            {/*    }}*/}
                            {/*>*/}
                            {/*    {t('close_label')}*/}
                            {/*</Button>*/}
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
    student: {
        id: 6,
        name: "Nastia",
        surname: "Gerasymchuk",
        patronymic: "Borisovna",
        email: "nasta7_2000@i.ua",
        user_id: 0,
        group: {
            id: 5,
            title: null,
            disable: false
        }
    }
});



AddStudentDialog = reduxForm({
    form: STUDENT_FORM
})(AddStudentDialog);
 connect(mapStateToProps, {})(AddStudentDialog);