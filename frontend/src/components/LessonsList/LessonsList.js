
import React from 'react';

import { FaEdit, FaUserPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MdContentCopy } from 'react-icons/all';
import i18n from 'i18next';
import './LessonList.scss';

const LessonsList = (props) => {
    const lessons = props.lessons;

    const t = props.translation;

    const firstStringLetterCapitalHandle = (str) => {
        return str.replace(/^\w/, (c) => c.toUpperCase());
    };

    const isGrouped = grouped =>
        grouped ? (
            <FaUserPlus
                title={t('formElements:grouped_label')}
                className='svg-btn copy-btn align-left info-btn'
            />
        ) : (
            ''
        );
    const getUkWordHours = (number) => {
        if (number === 1) {
            return 'година';
        }
        if (number >= 2 && number <= 4) {
            return 'години';
        }
        if ((number >= 5 && number <= 20) || number === 0) {
            return 'годин';
        }
        return;
    };
    const getUkHour = (number) => {
        if (number >= 20 && number <= 100) {
            let toText = number.toString(); //convert to string
            let lastChar = toText.slice(-1); //gets last character
            let lastDigit = +(lastChar); //convert last character to number
            return getUkWordHours(lastDigit);
        } else if (number > 100) {
            let toText = number.toString(); //convert to string
            let lastChar = toText.slice(-2); //gets last character
            let lastDigit = +(lastChar); //convert last character to number
            return getUkWordHours(lastDigit);
        } else {
            return getUkWordHours(number);
        }
    };
    const getEnHour = (number) => {
        if (number === 1) {
            return 'hour';
        }
        return 'hours';
    };
    const getHour = (number) => {
        const language = (i18n.language).toUpperCase();
        const en = 'EN';
        const uk = 'UK';
        if (language === en) {
            return getEnHour(number);
        } else if (language === uk) {
            return getUkHour(number);
        }
        return;
    };
    const getLessonShortTitle = (title) => {
        const MAX_LENGTH = 50;
        return title.length > MAX_LENGTH ? `${title.slice(0, MAX_LENGTH)}...` : title;
    };
    const getTitle = (lesson) => {
        return firstStringLetterCapitalHandle(
                lesson.subjectForSite) +
            ' ' +
            t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`);
    };
    return (
        <div>
            <section className='container-flex-wrap'>
                {lessons.map(lesson => (
                    <Card class='done-card' key={lesson.id}>

                        <div className='cards-btns'>
                            {isGrouped(lesson.grouped)}
                            <MdContentCopy
                                title={t('copy_lesson')}
                                className='svg-btn copy-btn'
                                onClick={() => props.onCopyLesson(lesson)}
                            />
                            <FaEdit
                                title={t('edit_lesson')}
                                className='svg-btn edit-btn'
                                onClick={() => props.onSelectLesson(lesson.id)}
                            />
                            <MdDelete
                                title={t('delete_lesson')}
                                className='svg-btn delete-btn'
                                onClick={() => props.onClickOpen(lesson.id)}
                            />
                        </div>
                        <p style={{ height: '3em' }}>
                            {getLessonShortTitle(getTitle(lesson))}

                        </p>
                        <p>{getTeacherName(lesson.teacher)}</p>
                        <p>
                            {' '}
                            <b>{lesson.hours}</b> {getHour(lesson.hours)}
                        </p>
                        <p>
                            <input value={lesson.linkToMeeting} disabled='disabled' />
                        </p>
                    </Card>
                ))}
            </section>
        </div>
    );
};

export default LessonsList;
