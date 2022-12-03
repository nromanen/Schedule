import React from 'react';
import './Button.scss';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled } from 'react-icons/all';
import { COMMON_SET_ENABLED } from '../../constants/translationLabels/common';

const DisabledButton = (props) => {
    const { className, ...propsData } = props;
    const { t } = useTranslation('formElements');
    return (
        <GiSightDisabled
            className={`svg-btn buttons-enabled-disabled-button ${className}`}
            title={t(COMMON_SET_ENABLED)}
            {...propsData}
        />
    );
};

export default DisabledButton;
