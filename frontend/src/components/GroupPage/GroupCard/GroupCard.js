import './GroupCard.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { dialogTypes } from '../../../constants/dialogs';
import {
    ADD_STUDENT_LINK,
    EDIT_LINK,
    GROUP_LIST_LINK,
    SHOW_STUDENTS_LINK,
} from '../../../constants/links';
import {
    COMMON_EDIT,
    COMMON_SET_DISABLED,
    COMMON_SET_ENABLED,
} from '../../../constants/translationLabels/common';
import {
    DELETE_TITLE_LABEL,
    FORM_SHOW_STUDENTS,
    FORM_STUDENT_ADD_LABEL,
    GROUP_LABEL,
} from '../../../constants/translationLabels/formElements';
import { getShortTitle } from '../../../helper/shortTitle';

const GroupCard = (props) => {
    const {
        item,
        disabled,
        setGroup,
        showConfirmDialog,
        showStudentsByGroup,
        showAddStudentDialog,
    } = props;
    const { t } = useTranslation('formElements');
    return (
        <section className="group-card">
            <div className="group-card__buttons-wrapper">
                {!disabled ? (
                    <>
                        <IoMdEye
                            className="group-card__buttons-hide link-href"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() => {
                                showConfirmDialog(item.id, dialogTypes.SET_VISIBILITY_DISABLED);
                            }}
                        />
                        <Link to={`${GROUP_LIST_LINK}/${item.id}${EDIT_LINK}`}>
                            <FaEdit
                                className="group-card__buttons-edit link-href"
                                title={t(COMMON_EDIT)}
                                onClick={() => setGroup(item)}
                            />
                        </Link>
                    </>
                ) : (
                    <GiSightDisabled
                        className="group-card__buttons-hide link-href"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showConfirmDialog(item.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                <MdDelete
                    className="group-card__buttons-delete link-href"
                    title={t(DELETE_TITLE_LABEL)}
                    onClick={() => showConfirmDialog(item.id, dialogTypes.DELETE_CONFIRM)}
                />
                <Link to={`${GROUP_LIST_LINK}/${item.id}${ADD_STUDENT_LINK}`}>
                    <span className="group-card__buttons">
                        <FaUserPlus
                            title={t(FORM_STUDENT_ADD_LABEL)}
                            className="svg-btn copy-btn align-left info-btn student"
                            onClick={() => {
                                showAddStudentDialog(item.id);
                            }}
                        />
                    </span>
                </Link>
            </div>
            <p className="group-card__description">{`${t(GROUP_LABEL)}:`}</p>
            <h1 className="group-card__number">{getShortTitle(item.title, 5)}</h1>
            <Link to={`${GROUP_LIST_LINK}/${item.id}${SHOW_STUDENTS_LINK}`}>
                <span className="group-card__button-students">
                    <FaUsers
                        title={t(FORM_SHOW_STUDENTS)}
                        className="svg-btn copy-btn align-left info-btn students"
                        onClick={() => {
                            showStudentsByGroup(item.id);
                        }}
                    />
                </span>
            </Link>
        </section>
    );
};

export default GroupCard;
