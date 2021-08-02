import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss'

import i18n from '../../../helper/i18n';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import RenderTeacherTable from '../../../helper/renderTeacherTable';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId } from '../../../services/studentService';

export const ShowStudentsDialog = props => {
    const { onClose,  cardId, open,group,onDeleteStudent,students,onSubmit} = props;
    const { t } = useTranslation('formElements');
    const handleClose = () => {
        onClose(cardId);
    };
    useEffect(()=> {
        getAllStudentsByGroupId(group.id);

    },[open])
    return (
        <Dialog
            disableBackdropClick={true}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                <>

                    <>
                        {students.length===0?
                            <>
                                <h2 className="title-align">{`${t('group_label')} - `}<span>{`${group.title}`}</span></h2>
                                {t('no_exist_students_in_group')}
                            </>

                            :
                            <>
                                <h3 className="title-align"><span>{students.length!==1?`${t('students_label')} `:`${t('student_label')}`}</span>{`${t('group_students')} `}<span>{`${group.title}`}</span></h3>
                                <RenderStudentTable group={group} onDeleteStudent={onDeleteStudent} students={students} onSubmit={onSubmit}/>
                            </>
                        }
                    </>
                </>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    onClick={() => onClose('')}
                    color="primary"
                >
                    {i18n.t('common:close_title')}
                </Button>
            </div>
        </Dialog>
    );
};

ShowStudentsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};


