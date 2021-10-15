import React from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import i18n from '../../../i18n';
import CustomDialog from '../CustomDialog';
import '../dialog.scss';
import RenderTeacherTable from '../../../helper/renderTeacherTable';

const ShowDepartmentDataDialog = (props) => {
    const { onClose, cardId, open, teachers, department } = props;
    const { t } = useTranslation('formElements');
    const handleClose = () => {
        onClose(cardId);
    };
    return (
        <CustomDialog
            onClose={handleClose}
            open={open}
            title="Show dependencies data"
            buttons={
                <Button
                    className="dialog-button"
                    variant="contained"
                    onClick={() => onClose('')}
                    color="primary"
                >
                    {i18n.t('common:close_title')}
                </Button>
            }
        >
            {isEmpty(teachers) ? (
                <>
                    <h2 className="title-align">
                        {`${t('department_teachers_label')} - `}
                        <span>{`${department.name}`}</span>
                    </h2>
                    {t('no_exist_teachers_at_department')}
                </>
            ) : (
                <>
                    <h3 className="title-align">
                        <span>
                            {teachers.length !== 1
                                ? `${t('teachers_label')} `
                                : `${t('teacher_label')} `}
                        </span>
                        {`${t('department_teachers')} `}
                        <span>{`${department.name}`}</span>
                    </h3>
                    <RenderTeacherTable teachers={teachers} />
                </>
            )}
        </CustomDialog>
    );
};

ShowDepartmentDataDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
    department: state.departments.department,
});

export default connect(mapStateToProps, {})(ShowDepartmentDataDialog);
