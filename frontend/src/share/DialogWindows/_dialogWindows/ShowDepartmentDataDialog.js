import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';

import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import '../dialog.scss';
import RenderTeacherTable from '../../../helper/renderTeacherTable';
import {
    DEPARTMENT_TEACHER_LABEL,
    DEPARTMENT_TEACHERS,
    NO_EXIST_TEACHER_AT_DEPARTMENT,
    TEACHER_LABEL,
    TEACHERS_LABEL,
} from '../../../constants/translationLabels/formElements';
import { dialogCloseButton } from '../../../constants/dialogs';

const ShowDepartmentDataDialog = ({ onClose, cardId, open, teachers, department }) => {
    const { t } = useTranslation('formElements');

    return (
        <CustomDialog
            onClose={() => onClose(cardId)}
            open={open}
            title="Show dependencies data"
            buttons={[dialogCloseButton(() => onClose(''))]}
        >
            {isEmpty(teachers) ? (
                <>
                    <h2 className="title-align">
                        {`${t(DEPARTMENT_TEACHER_LABEL)} - `}
                        <span>{department?.name}</span>
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
                        <span>{department?.name}</span>
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
    department: PropTypes.object,
    teachers: PropTypes.array,
};

export default ShowDepartmentDataDialog;
