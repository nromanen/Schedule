import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { reset } from 'redux-form';
import { STUDENT_FORM } from '../../../constants/reduxForms';
import AddStudentForm from '../../../containers/Students/AddStudentForm';
import { goToGroupPage } from '../../../helper/pageRedirection';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { dialogCloseButton } from '../../../constants/dialogs';
import '../dialog.scss';

const AddStudentDialog = (props) => {
    const { setOpen, open, student, groupId, createStudentStart, updateStudentStart } = props;
    const { t } = useTranslation('formElements');
    const history = useHistory();

    const handleClose = () => {
        setOpen(false);
        goToGroupPage(history);
    };

    const onReset = () => {
        reset(STUDENT_FORM);
    };

    const onSubmitStudent = (data) => {
        return !data.id
            ? createStudentStart({ ...data, group: { id: groupId } })
            : updateStudentStart({ ...data, group: { id: data.group } });
    };

    return (
        <CustomDialog
            title={student ? t('edit_title') : `${t('create_title')} ${t('student_a_label')}`}
            open={open}
            onClose={handleClose}
            buttons={[dialogCloseButton(handleClose)]}
        >
            <AddStudentForm onSubmit={onSubmitStudent} onReset={onReset} student={student} />
        </CustomDialog>
    );
};

AddStudentDialog.propTypes = {
    open: PropTypes.bool.isRequired,
};

export default AddStudentDialog;
