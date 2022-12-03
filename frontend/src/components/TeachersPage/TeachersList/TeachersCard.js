import './TeachersList.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import Card from '../../../share/Card/Card';

import { dialogTypes } from '../../../constants/dialogs';
import { getTeacherFullName } from '../../../helper/renderTeacher';
import { getShortTitle } from '../../../helper/shortTitle';
import {
    COMMON_SET_DISABLED,
    COMMON_SET_ENABLED,
    TEACHER_DEPARTMENT,
} from '../../../constants/translationLabels/common';
import { MAX_LENGTH_40 } from '../../../constants/common';
import DeleteButton from '../../Buttons/DeleteButton';
import EditButton from '../../Buttons/EditButton';
import EnabledButton from '../../Buttons/EnabledButton';
import DisabledButton from '../../Buttons/DisabledButton';

const TeachersCard = (props) => {
    const { t } = useTranslation('common');

    const { isDisabled, showConfirmDialog, teacherItem, selectedTeacherCard } = props;

    const sendMail = (email) => {
        const mailto = `mailto:${email}`;
        window.location.href = mailto;
    };

    return (
        <Card key={teacherItem.id} additionClassName="teacher-card">
            <div className="cards-btns">
                {!isDisabled ? (
                    <>
                        <EnabledButton
                            onClick={() => {
                                showConfirmDialog(
                                    teacherItem.id,
                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                );
                            }}
                        />
                        <EditButton
                            onClick={(_) => {
                                selectedTeacherCard(teacherItem.id);
                            }}
                        />
                    </>
                ) : (
                    <DisabledButton
                        onClick={() => {
                            showConfirmDialog(teacherItem.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                <DeleteButton
                    onClick={(_) => showConfirmDialog(teacherItem.id, dialogTypes.DELETE_CONFIRM)}
                />
            </div>
            <h2 className="teacher-card__name">
                {getShortTitle(getTeacherFullName(teacherItem), MAX_LENGTH_40)}
            </h2>
            <p className="teacher-card__title">
                {`${teacherItem.position} ${
                    teacherItem.department !== null
                        ? `${t(TEACHER_DEPARTMENT)} ${teacherItem.department.name}`
                        : ''
                }`}
            </p>
            {teacherItem.email && (
                <button
                    type="button"
                    className="teacher-card__email"
                    onClick={() => {
                        sendMail(teacherItem.email);
                    }}
                >
                    {teacherItem.email}
                </button>
            )}
        </Card>
    );
};

export default TeachersCard;
