import React from 'react';
import { FaEdit, FaUsers, FaFileArchive } from 'react-icons/fa';
import { MdDelete, MdDonutSmall } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import './SemesterList.scss';
import { GiSightDisabled, IoMdEye, FaCopy } from 'react-icons/all';
import Card from '../../../share/Card/Card';
import { dialogTypes } from '../../../constants/dialogs';
import {
    EDIT_TITLE,
    DELETE_TITLE,
    COPY_LABEL,
    FORM_SHOW_GROUPS,
    SET_DEFAULT_TITLE,
} from '../../../constants/translationLabels/formElements';
import {
    COMMON_SET_DISABLED,
    COMMON_DAYS_LABEL,
    COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE,
    SEMESTER_LABEL,
    COMMON_MAKE_ARCHIVE,
    COMMON_SET_ENABLED,
} from '../../../constants/translationLabels/common';

const SemesterCard = (props) => {
    const {
        disabled,
        archived,
        selectSemester,
        showConfirmDialog,
        setIsOpenSemesterCopyForm,
        setSemesterId,
        createArchivedSemester,
        setSemesterGroupsOptions,
        setIsOpenGroupsDialog,
        semDays,
        groups,
        semesterItem,
    } = props;
    const { t } = useTranslation('formElements');

    return (
        <Card
            additionClassName={`semester-card done-card ${
                semesterItem.currentSemester ? 'current' : ''
            }`}
        >
            <div className="cards-btns">
                {!(disabled || archived) && (
                    <>
                        <IoMdEye
                            className="svg-btn copy-btn"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() => {
                                showConfirmDialog(
                                    semesterItem.id,
                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                );
                            }}
                        />
                        <FaEdit
                            className="svg-btn edit-btn"
                            title={t(EDIT_TITLE)}
                            onClick={() => {
                                selectSemester(semesterItem.id);
                            }}
                        />
                        <FaCopy
                            className="svg-btn copy-btn"
                            title={t(COPY_LABEL)}
                            onClick={() => {
                                setIsOpenSemesterCopyForm(true);
                                setSemesterId(semesterItem.id);
                            }}
                        />
                        {!semesterItem.currentSemester && (
                            <FaFileArchive
                                className="svg-btn archive-btn"
                                title={t(COMMON_MAKE_ARCHIVE)}
                                onClick={() => {
                                    createArchivedSemester(semesterItem.id);
                                }}
                            />
                        )}
                    </>
                )}
                {disabled && !archived && (
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showConfirmDialog(semesterItem.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                {/* {archived && (
                                <IoMdEye
                                    className="svg-btn copy-btn"
                                    title={t(COMMON_PREVIEW)}
                                    onClick={() => {
                                        handleSemesterArchivedPreview(semesterItem.id);
                                    }}
                                />
                            )} */}
                <MdDelete
                    className="svg-btn delete-btn"
                    title={t(DELETE_TITLE)}
                    onClick={() => showConfirmDialog(semesterItem.id, dialogTypes.DELETE_CONFIRM)}
                />

                <MdDonutSmall
                    className={`svg-btn edit-btn ${semesterItem.defaultSemester ? 'default' : ''}`}
                    title={t(SET_DEFAULT_TITLE)}
                    onClick={() => showConfirmDialog(semesterItem.id, dialogTypes.SET_DEFAULT)}
                />
            </div>

            <p className="semester-card__description">
                <small>{`${t(SEMESTER_LABEL)}:`}</small>
                <b>{semesterItem.description}</b>
                {` ( ${semesterItem.year} )`}
            </p>
            <p className="semester-card__description">
                <b>
                    {semesterItem.startDay} - {semesterItem.endDay}
                </b>
            </p>
            <p className="semester-card__description">
                {`${t(COMMON_DAYS_LABEL)}: `}
                {semDays.join(', ')}
            </p>
            <p className="semester-card__description">
                {`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}
                {semesterItem.semester_classes
                    .map((classItem) => {
                        return classItem.class_name;
                    })
                    .join(', ')}
            </p>

            <FaUsers
                title={t(FORM_SHOW_GROUPS)}
                className="svg-btn copy-btn  semester-groups"
                onClick={() => {
                    setSemesterId(semesterItem.id);
                    setSemesterGroupsOptions(groups);
                    setIsOpenGroupsDialog(true);
                }}
            />
        </Card>
    );
};

export default SemesterCard;
