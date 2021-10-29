import React, { useEffect, useState } from 'react';
import { FaEdit, FaUsers, FaFileArchive } from 'react-icons/fa';
import { MdDelete, MdDonutSmall } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import './SemesterItem.scss';
import { GiSightDisabled, IoMdEye, FaCopy } from 'react-icons/all';
import Card from '../../share/Card/Card';
import NotFound from '../../share/NotFound/NotFound';
import { selectSemesterService } from '../../services/semesterService';
import { dialogTypes } from '../../constants/dialogs';
import {
    EDIT_TITLE,
    DELETE_TITLE,
    COPY_LABEL,
    SEMESTERY_LABEL,
    FORM_SHOW_GROUPS,
    SET_DEFAULT_TITLE,
} from '../../constants/translationLabels/formElements';
import {
    COMMON_SET_DISABLED,
    COMMON_DAYS_LABEL,
    COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE,
    SEMESTER_LABEL,
    COMMON_MAKE_ARCHIVE,
    COMMON_SET_ENABLED,
} from '../../constants/translationLabels/common';
import { search } from '../../helper/search';

const SemesterItem = (props) => {
    const { t } = useTranslation('formElements');
    const {
        archived,
        disabled,
        setSemesterId,
        setSubDialogType,
        setOpenSubDialog,
        setIsOpenSemesterCopyForm,
        setOpenGroupsDialog,
        term,
        enabledSemesters,
        disabledSemesters,
        // archivedSemesters,
        createArchivedSemester,
        // getArchivedSemester,
    } = props;
    const [visibleItems, setVisibleItems] = useState([]);

    const searchArr = ['year', 'description', 'startDay', 'endDay'];

    useEffect(() => {
        if (disabled) setVisibleItems(search(disabledSemesters, term, searchArr));
        // it doesnt work, need to finish implement archeved functionality
        // if (archived) setVisibleItems(search(archivedSemesters, term, searchArr));
        else setVisibleItems(search(enabledSemesters, term, searchArr));
    }, [disabled, enabledSemesters, term]);

    const showConfirmDialog = (id, dialogType) => {
        setSemesterId(id);
        setSubDialogType(dialogType);
        setOpenSubDialog(true);
    };

    const showSemesterCopyForm = (id) => {
        setSemesterId(id);
        setIsOpenSemesterCopyForm(true);
    };
    // it doesnt work, need to finish implement archeved functionality
    // const handleSemesterArchivedPreview = (currentSemesterId) => {
    //     getArchivedSemester(+currentSemesterId);
    // };
    const setClassNameForDefaultSemester = (currentSemester) => {
        const defaultSemesterName = 'default';
        const className = 'svg-btn edit-btn';
        return currentSemester.defaultSemester ? `${className} ${defaultSemesterName}` : className;
    };
    return (
        <section className="container-flex-wrap wrapper">
            {visibleItems.length === 0 && <NotFound name={t(SEMESTERY_LABEL)} />}
            {visibleItems.map((semesterItem) => {
                const semDays = [];
                semesterItem.semester_days.forEach((day) =>
                    semDays.push(t(`common:day_of_week_${day}`)),
                );
                return (
                    <Card
                        key={semesterItem.id}
                        additionClassName={`semester-card done-card ${
                            semesterItem.currentSemester ? 'current' : ''
                        }`}
                    >
                        <div className="cards-btns">
                            {!(disabled || archived) && (
                                <>
                                    <GiSightDisabled
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
                                            selectSemesterService(semesterItem.id);
                                        }}
                                    />
                                    <FaCopy
                                        className="svg-btn copy-btn"
                                        title={t(COPY_LABEL)}
                                        onClick={() => {
                                            showSemesterCopyForm(semesterItem.id);
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
                                <IoMdEye
                                    className="svg-btn copy-btn"
                                    title={t(COMMON_SET_ENABLED)}
                                    onClick={() => {
                                        showConfirmDialog(
                                            semesterItem.id,
                                            dialogTypes.SET_VISIBILITY_ENABLED,
                                        );
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
                                onClick={() =>
                                    showConfirmDialog(semesterItem.id, dialogTypes.DELETE_CONFIRM)
                                }
                            />

                            <MdDonutSmall
                                className={setClassNameForDefaultSemester(semesterItem)}
                                title={t(SET_DEFAULT_TITLE)}
                                onClick={() =>
                                    showConfirmDialog(semesterItem.id, dialogTypes.SET_DEFAULT)
                                }
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
                                selectSemesterService(semesterItem.id);
                                setOpenGroupsDialog(true);
                            }}
                        />
                    </Card>
                );
            })}
        </section>
    );
};

export default SemesterItem;
