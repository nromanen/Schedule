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
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';

const SemesterCard = (props) => {
    const {
        disabled,
        archived,
        selectSemesterSuccess,
        showConfirmDialog,
        setIsOpenSemesterCopyForm,
        setSemesterId,
        createArchivedSemester,
        setSemesterGroupsOptions,
        setIsOpenGroupsDialog,
        semDays,
        semester,
    } = props;
    const { t } = useTranslation('formElements');

    return (
        <Card
            additionClassName={`semester-card done-card ${
                semester.currentSemester ? 'current' : ''
            }`}
        >
            <div className="cards-btns">
                {!(disabled || archived) && (
                    <>
                        <IoMdEye
                            className="svg-btn copy-btn"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() => {
                                showConfirmDialog(semester.id, dialogTypes.SET_VISIBILITY_DISABLED);
                            }}
                        />
                        <FaEdit
                            className="svg-btn edit-btn"
                            title={t(EDIT_TITLE)}
                            onClick={() => {
                                selectSemesterSuccess(semester.id);
                            }}
                        />
                        <FaCopy
                            className="svg-btn copy-btn"
                            title={t(COPY_LABEL)}
                            onClick={() => {
                                setIsOpenSemesterCopyForm(true);
                                setSemesterId(semester.id);
                            }}
                        />
                        {!semester.currentSemester && (
                            <FaFileArchive
                                className="svg-btn archive-btn"
                                title={t(COMMON_MAKE_ARCHIVE)}
                                onClick={() => {
                                    createArchivedSemester(semester.id);
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
                            showConfirmDialog(semester.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                {/* {archived && (
                                <IoMdEye
                                    className="svg-btn copy-btn"
                                    title={t(COMMON_PREVIEW)}
                                    onClick={() => {
                                        handleSemesterArchivedPreview(semester.id);
                                    }}
                                />
                            )} */}
                <MdDelete
                    className="svg-btn delete-btn"
                    title={t(DELETE_TITLE)}
                    onClick={() => showConfirmDialog(semester.id, dialogTypes.DELETE_CONFIRM)}
                />

                {!(disabled || archived) && (
                    <MdDonutSmall
                        className={`svg-btn edit-btn ${semester.defaultSemester ? 'default' : ''}`}
                        title={t(SET_DEFAULT_TITLE)}
                        onClick={() => showConfirmDialog(semester.id, dialogTypes.SET_DEFAULT)}
                    />
                )}
            </div>

            <p className="semester-card__description">
                <small>{`${t(SEMESTER_LABEL)}:`}</small>
                <b>{semester.description}</b>
                {` ( ${semester.year} )`}
            </p>
            <p className="semester-card__description">
                <b>
                    {semester.startDay} - {semester.endDay}
                </b>
            </p>
            <p className="semester-card__description">
                {`${t(COMMON_DAYS_LABEL)}: `}
                {semDays.join(', ')}
            </p>
            <p className="semester-card__description">
                {`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}
                {semester.semester_classes
                    .map((classItem) => {
                        return classItem.class_name;
                    })
                    .join(', ')}
            </p>

            {!(disabled || archived) && (
                <FaUsers
                    title={t(FORM_SHOW_GROUPS)}
                    className="svg-btn copy-btn  semester-groups"
                    onClick={() => {
                        setSemesterId(semester.id);
                        setSemesterGroupsOptions(
                            getGroupsOptionsForSelect(semester.semester_groups),
                        );
                        setIsOpenGroupsDialog(true);
                    }}
                />
            )}
        </Card>
    );
};

export default SemesterCard;
