import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FaEdit, FaUserPlus } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/all';
import { MdDelete } from 'react-icons/md';

import Card from '../../share/Card/Card';
import { getTeacherName } from '../../helper/renderTeacher';
import { firstStringLetterCapital } from '../../helper/strings';
import { FORM_GROUPED_LABEL } from '../../constants/translationLabels/formElements';
import { COPY_LESSON, DELETE_LESSON, EDIT_LESSON } from '../../constants/translationLabels/common';
import './LessonsList.scss';

const LessonsList = (props) => {
    const { lessons, onCopyLesson, onSelectLesson, onClickOpen } = props;
    const { t } = useTranslation(['common', 'formElements']);

    const getLessonShortTitle = (title) => {
        const MAX_LENGTH = 50;
        return title.length > MAX_LENGTH ? `${title.slice(0, MAX_LENGTH)}...` : title;
    };
    const getTitle = (lesson) => {
        return `${firstStringLetterCapital(lesson.subjectForSite)} ${t(
            `lesson_type_${lesson.lessonType.toLowerCase()}_label`,
            { ns: 'formElements' },
        )}`;
    };
    return (
        <div>
            <section className="container-flex-wrap lesson-container">
                {lessons.map((lesson) => (
                    <Card additionClassName="done-card" key={lesson.id}>
                        <div className="cards-btns">
                            {lesson.grouped && (
                                <FaUserPlus
                                    title={t(FORM_GROUPED_LABEL, { ns: 'formElements' })}
                                    className="svg-btn copy-btn align-left info-btn"
                                />
                            )}
                            <MdContentCopy
                                title={t(COPY_LESSON)}
                                className="svg-btn copy-btn"
                                onClick={() => onCopyLesson(lesson)}
                            />
                            <FaEdit
                                title={t(EDIT_LESSON)}
                                className="svg-btn edit-btn"
                                onClick={() => onSelectLesson(lesson.id)}
                            />
                            <MdDelete
                                title={t(DELETE_LESSON)}
                                className="svg-btn delete-btn"
                                onClick={() => onClickOpen(lesson.id)}
                            />
                        </div>
                        <p className="title">{getLessonShortTitle(getTitle(lesson))}</p>
                        <p>{getTeacherName(lesson.teacher)}</p>
                        <p>
                            <Trans
                                i18nKey="hour"
                                count={lesson.hours}
                                ns="common"
                                components={[<strong key="strong" />]}
                            >
                                {{ count: lesson.hours }}
                            </Trans>
                        </p>
                        <input value={lesson.linkToMeeting} disabled />
                    </Card>
                ))}
            </section>
        </div>
    );
};

export default LessonsList;
