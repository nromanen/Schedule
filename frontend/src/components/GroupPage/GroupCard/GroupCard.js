import './GroupCard.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { dialogTypes } from '../../../constants/dialogs';
import { ADD_STUDENT_LINK, GROUP_LIST_LINK, SHOW_STUDENTS_LINK } from '../../../constants/links';
import { COMMON_EDIT, COMMON_SET_DISABLED, COMMON_SET_ENABLED } from '../../../constants/translationLabels/common';
import {
    DELETE_TITLE_LABEL,
    FORM_SHOW_STUDENTS,
    FORM_STUDENT_ADD_LABEL,
    GROUP_LABEL,
} from '../../../constants/translationLabels/formElements';
import Card from '../../../share/Card/Card';

const GroupCard = ({ group, disabled, setGroup, showConfirmDialog, showStudentsByGroup, showAddStudentDialog }) => {
    const { t } = useTranslation('formElements');

    return (
        <Card additionClassName="group-card">
            <p className="group-card__label">{t(GROUP_LABEL)}:</p>
            <h3 className="group-card__title">{group.title}</h3>
            <div className="cards-btns">
                {!disabled ? (
                    <>
                        <IoMdEye
                            className="svg-btn copy-btn"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() => showConfirmDialog(group.id, dialogTypes.SET_VISIBILITY_DISABLED)}
                        />
                        <FaEdit
                            className="svg-btn edit-btn"
                            title={t(COMMON_EDIT)}
                            onClick={() => setGroup(group)}
                        />
                    </>
                ) : (
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => showConfirmDialog(group.id, dialogTypes.SET_VISIBILITY_ENABLED)}
                    />
                )}
                <MdDelete
                    className="svg-btn delete-btn"
                    title={t(DELETE_TITLE_LABEL)}
                    onClick={() => showConfirmDialog(group.id, dialogTypes.DELETE_CONFIRM)}
                />
            </div>
            {!disabled && (
                <div className="cards-btns group-card__students-btns">
                    <Link to={`${GROUP_LIST_LINK}/${group.id}${ADD_STUDENT_LINK}`}>
                        <FaUserPlus
                            className="svg-btn student-btn"
                            title={t(FORM_STUDENT_ADD_LABEL)}
                            onClick={() => showAddStudentDialog(group.id)}
                        />
                    </Link>
                    <Link to={`${GROUP_LIST_LINK}/${group.id}${SHOW_STUDENTS_LINK}`}>
                        <FaUsers
                            className="svg-btn student-btn"
                            title={t(FORM_SHOW_STUDENTS)}
                            onClick={() => showStudentsByGroup(group.id)}
                        />
                    </Link>
                </div>
            )}
        </Card>
    );
};

export default GroupCard;