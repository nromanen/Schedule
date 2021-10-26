import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import i18n from '../../../i18n';
import CustomDialog from '../CustomDialog';
import '../dialog.scss';
import RenderTeacherTable from '../../../helper/renderTeacherTable';
import { COMMON_CLOSE_TITLE } from '../../../constants/translationLabels/common';
import {
    TEACHERS_LABEL,
    TEACHER_LABEL,
    DEPARTMENT_TEACHER_LABEL,
    NO_EXIST_TEACHER_AT_DEPARTMENT,
    DEPARTMENT_TEACHERS,
} from '../../../constants/translationLabels/formElements';

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
            buttons={[
                {
                    label: i18n.t(COMMON_CLOSE_TITLE),
                    handleClick: () => onClose(''),
                    color: 'primary',
                },
            ]}
        >
            {isEmpty(teachers) ? (
                <>
                    <h2 className="title-align">
                        {`${t(DEPARTMENT_TEACHER_LABEL)} - `}
                        <span>{`${department.name}`}</span>
                    </h2>
                    {t(NO_EXIST_TEACHER_AT_DEPARTMENT)}
                </>
            ) : (
                <>
                    <h3 className="title-align">
                        <span>
                            {teachers.length !== 1
                                ? `${t(TEACHERS_LABEL)} `
                                : `${t(TEACHER_LABEL)} `}
                        </span>
                        {`${t(DEPARTMENT_TEACHERS)} `}
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
