import '../dialog.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { goToGroupPage } from '../../../helper/pageRedirection';
import CustomDialog from '../CustomDialog';
import { AddStudentForm } from '../../../components/AddStudentForm/AddStudentForm';
import {
    getAllStudentsByGroupId,
    createStudentService,
    deleteStudentService,
    updateStudentService,
} from '../../../services/studentService';

const AddStudentDialog = (props) => {
    const { t } = useTranslation('formElements');
    const { onSetSelectedCard, open, group, groups, student } = props;
    const studentId = student.id;
    const history = useHistory();

    const handleClose = () => {
        onSetSelectedCard(null);
        goToGroupPage(history);
    };

    const onReset = () => {
        onSetSelectedCard(null);
        goToGroupPage(history);
    };

    const onSubmitStudent = (data) => {
        if (data.id !== undefined) {
            const sendData = { ...data, group: { id: data.group } };
            updateStudentService(sendData);
        } else {
            const sendData = { ...data, group: { id: groupId } };
            createStudentService(sendData);
        }
        setAddStudentDialog(false);
        goToGroupPage(history);
    };

    return (
        <CustomDialog
            title={studentId ? t('edit_title') : `${t('create_title')} ${t('student_a_label')}`}
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
