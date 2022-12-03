import React from 'react';
import './Button.scss';
import { useTranslation } from 'react-i18next';
import { IoMdEye } from 'react-icons/all';
import { COMMON_SET_DISABLED } from '../../constants/translationLabels/common';

const EnabledButton = (props) => {
    const { className, ...propsData } = props;
    const { t } = useTranslation('formElements');
    return (
        <IoMdEye
            className={`svg-btn buttons-enabled-disabled-button ${className}`}
            title={t(COMMON_SET_DISABLED)}
            {...propsData}
        />
    );
};

export default EnabledButton;
