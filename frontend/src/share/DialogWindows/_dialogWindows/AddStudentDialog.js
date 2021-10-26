import '../dialog.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { reset } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { STUDENT_FORM } from '../../../constants/reduxForms';
import { goToGroupPage } from '../../../helper/pageRedirection';
import CustomDialog from '../CustomDialog';
import AddStudentForm from '../../../containers/Student/AddStudentForm';

export const AddStudentDialog = (props) => {
    const { setAddStudentDialog, open, student, groupId, startCreateStudent, startUpdateStudent } =
        props;
    const { t } = useTranslation('formElements');
    const history = useHistory();

    const handleClose = () => {
        setAddStudentDialog(false);
        goToGroupPage(history);
    };

    const onReset = () => {
        // goToGroupPage(history);
        reset(STUDENT_FORM);
    };

    const onSubmitStudent = (data) => {
        // setAddStudentDialog(false);
        // goToGroupPage(history);
        return !data.id
            ? startCreateStudent({ ...data, group: { id: groupId } })
            : startUpdateStudent({ ...data, group: { id: data.group } });
    };

    return (
        <CustomDialog
            title={student.id ? t('edit_title') : `${t('create_title')} ${t('student_a_label')}`}
            open={open}
            onClose={handleClose}
            buttons={
                <Button className="buttons-style" variant="contained" onClick={handleClose}>
                    {t('cancel_button_label')}
                </Button>
            }
        >
            <AddStudentForm onSubmit={onSubmitStudent} onReset={onReset} />
        </CustomDialog>
    );
};

AddStudentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};
