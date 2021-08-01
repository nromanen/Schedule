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
import Select from 'react-select';
import renderSelectField from '../../renderedFields/select';
 let AddStudentDialog =( props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, reset,open,groups,student} = props;
    // const student={
    //     // id: 6,
    //     // name: "Nastia",
    //     // surname: "Gerasymchuk",
    //     // patronymic: "Borisovna",
    //     // email: "nasta7_2000@i.ua",
    //     // user_id: 0,
    //     // group: {
    //     //     id: 5,
    //     //     title: null,
    //     //     disable: false
    //     // }
    // };
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
            group:student.group.id
        });
    };
    const getGroupOptions = () => {
        return groups.map(item=>{return {value:item.id,label:item.title}})
    }
    const parseStudentGroupOption = () => {
        const currentStudent=student;
        return currentStudent.group!==undefined?{value:currentStudent.group.id,label:currentStudent.group.title}:currentStudent;
    }
    const groupOptions=getGroupOptions();
    const defaultGroupOption=parseStudentGroupOption();
     // const handleChange = (newValue, actionMeta) => {
     //     props.onChangeSemesterValue(newValue);
     // };
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
                    {console.log(props)}

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
                        {console.log(groups)}
                        {studentId?
                            // <Select
                            //     name="group"
                            //     id="group"
                            //     defaultValue={defaultGroupOption}
                            //     options={groupOptions}
                            //     onChange={handleChange}
                            //     // formatGroupLabel={formatGroupLabel}
                            // />

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
    student: state.students.student,
    groups: state.groups.groups,
});



AddStudentDialog = reduxForm({
    form: STUDENT_FORM
})(AddStudentDialog);
export default connect(mapStateToProps, {})(AddStudentDialog);
// const mapStateToProps = state => ({
//     groups: state.groups.groups,
//     student: state.students.student,
//
// });
//
// connect(mapStateToProps)(
//     reduxForm({
//         form: STUDENT_FORM
//     })(AddStudentDialog))
// const mapStateToProps = state => ({ group: state.groups.group });
//
// AddStudentDialog = reduxForm({
//     form: STUDENT_FORM
// })(AddStudentDialog);
//
// export default connect(mapStateToProps)(AddStudentDialog);