import React from 'react';

import Card from '../../share/Card/Card';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MdContentCopy } from 'react-icons/all';

const LessonsList = props => {
    const lessons = props.lessons;

    const t = props.translation;

    const firstStringLetterCapitalHandle = str => {
        return str.replace(/^\w/, c => c.toUpperCase());
    };

    return (
        <div>
            <section className="container-flex-wrap">
                {lessons.map(lesson => (
                    <Card class="done-card" key={lesson.id}>
                        <div className="cards-btns">
                            <MdContentCopy
                                title={t('copy_lesson')}
                                className="svg-btn copy-btn"
                                onClick={() => props.onCopyLesson(lesson)}
                            />
                            <FaEdit
                                title={t('delete_lesson')}
                                className="svg-btn edit-btn"
                                onClick={() => props.onSelectLesson(lesson.id)}
                            />
                            <MdDelete
                                title={t('edit_lesson')}
                                className="svg-btn delete-btn"
                                onClick={() => props.onClickOpen(lesson.id)}
                            />
                        </div>
                        <p>
                            {firstStringLetterCapitalHandle(
                                lesson.subjectForSite
                            )}
                            {' '}(
                            {t(
                                `formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`
                            )}
                            )
                        </p>
                        <p>{lesson.teacherForSite}</p>
                        <p>
                            {' '}
                            <b>{lesson.hours}</b>{' '}
                            {t('formElements:hours_label')}
                        </p>
                    </Card>
                ))}
            </section>
        </div>
    );
};

export default LessonsList;
