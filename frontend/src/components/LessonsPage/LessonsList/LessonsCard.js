import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FaEdit, FaUserPlus } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/all';
import { MdDelete } from 'react-icons/md';

import Card from '../../../share/Card/Card';
import { getTeacherName } from '../../../helper/renderTeacher';
import { getShortTitle } from '../../../helper/shortTitle';

import { firstStringLetterCapital } from '../../../helper/strings';
import { FORM_GROUPED_LABEL } from '../../../constants/translationLabels/formElements';
import { MAX_LENGTH_50 } from '../../../constants/common';
import {
    COPY_LESSON,
    DELETE_LESSON,
    EDIT_LESSON,
} from '../../../constants/translationLabels/common';
import './LessonList.scss';

const LessonsCard = (props) => {
    const { lesson, onCopyLesson, onSelectLesson, onClickOpen } = props;

    const { t } = useTranslation(['common', 'formElements']);

    const getTitle = (lessonItem) => {
        return `${firstStringLetterCapital(lessonItem.subjectForSite)}`;
    };

    const getType = (lessonItem) => {
        return `${t(`lesson_type_${lessonItem.lessonType.toLowerCase()}_label`, {
            ns: 'formElements',
        })}`;
    };

    return (
        <Card additionClassName="done-lesson-card">
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
            <p className="title" title={lesson.subjectForSite}>
                {getShortTitle(getTitle(lesson), MAX_LENGTH_50)}
            </p>
            <p>{getType(lesson)}</p>
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
            {lesson.linkToMeeting && (
                <a
                    className="lesson-link"
                    href={lesson.linkToMeeting}
                    target="_blank"
                    rel="noreferrer"
                >
                    {lesson.linkToMeeting}
                </a>
            )}
        </Card>
    );
};

export default LessonsCard;
