import React from 'react'
import {COMMON_EDIT_HOVER_TITLE} from "../../constants/translationLabels/common";
import './Button.scss'
import {useTranslation} from "react-i18next";
import {FaEdit} from "react-icons/fa";

const EditButton = (props) => {
    const {className, ...propsData} = props;
    const {t} = useTranslation('formElements');
    return (<FaEdit
        className={`svg-btn buttons-edit-button ${className}`}
        title={t(COMMON_EDIT_HOVER_TITLE)}
        {...propsData}
    />)
}

export default EditButton;
