import React from 'react';

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

export const ShowDataDialog = props => {
    const { onClose,  cardId, open,teachers,department } = props;
    const { t } = useTranslation('formElements');
    const handleClose = () => {
        onClose(cardId);
    };
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
                        {teachers.length===0?
                            <>
                                <h2 className="title-align">{`${t('department_teachers_label')} - `}<span>{`${department.name}`}</span></h2>
                                {t('no_exist_teachers_at_department')}
                            </>

                            :
                            <>
                                <h3 className="title-align"><span>{teachers.length!==1?`${t('teachers_label')} `:`${t('teacher_label')}`}</span>{`${t('department_teachers')} `}<span>{`${department.name}`}</span></h3>
                                <RenderTeacherTable teachers={teachers}/>
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

ShowDataDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
    department: state.departments.department
});

export default connect(mapStateToProps, {})(ShowDataDialog);