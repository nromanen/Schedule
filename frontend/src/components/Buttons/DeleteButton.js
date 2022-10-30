import React from 'react'
import {MdDelete} from "react-icons/md";
import {COMMON_DELETE_HOVER_TITLE} from "../../constants/translationLabels/common";
import './Button.scss'
import {useTranslation} from "react-i18next";

const DeleteButton = (props) => {
    const {className, ...propsData} = props;
    const { t } = useTranslation('formElements');
    return (<MdDelete
        className={`svg-btn buttons-delete-button ${className}`}
        title={t(COMMON_DELETE_HOVER_TITLE)}
        {...propsData}
        />)
}

export default DeleteButton;
