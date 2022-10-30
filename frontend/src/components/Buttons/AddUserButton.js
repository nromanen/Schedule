import React from 'react';
import './Button.scss';
import { useTranslation } from 'react-i18next';
import { FORM_STUDENT_ADD_LABEL } from '../../constants/translationLabels/formElements';

const AddUserButton = (props) => {
    const { className, ...propsData } = props;
    const { t } = useTranslation('formElements');
    return (
        <FaUserPlus
            className={`svg-btn buttons-add-user-button ${className}`}
            title={t(FORM_STUDENT_ADD_LABEL)}
            {...propsData}
        />
    );
};

export default AddUserButton;
