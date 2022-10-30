import React from 'react';
import './Button.scss';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { SHOW_TEACHER_TITLE } from '../../constants/translationLabels/formElements';

const GetMoreButton = (props) => {
    const { className, ...propsData } = props;
    const { t } = useTranslation('formElements');
    return (
        <FaChalkboardTeacher
            className={`svg-btn buttons-get-more-button ${className}`}
            title={t(SHOW_TEACHER_TITLE)}
            {...propsData}
        />
    );
};

export default GetMoreButton;
