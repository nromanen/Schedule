import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';

const TemporaryScheduleList = props => {
    const { t } = useTranslation('formElements');

    const shortId = require('shortid');

    const temporarySchedules = props.temporarySchedules || [];
    return (
        <>
            {temporarySchedules.length > 0 ? (
                temporarySchedules.map(temporarySchedule => (
                    <section className="card" key={shortId.generate()}>
                        <section className="centered-container">
                            <h2>{temporarySchedule.date}</h2>
                        </section>
                        <Divider />
                        <section className="temporary-schedule-list">
                            {temporarySchedule.schedules.map(schedule => (
                                <section
                                    className="temporary-schedule-row"
                                    key={shortId.generate()}
                                >
                                    <Card class="done-card text-center">
                                        {!schedule.temporary_schedule && (
                                            <div className="cards-btns">
                                                <FaEdit
                                                    title={t(
                                                        'delete_lesson_changes'
                                                    )}
                                                    className="svg-btn edit-btn"
                                                />
                                                <MdDelete
                                                    title={t(
                                                        'edit_lesson_lesson'
                                                    )}
                                                    className="svg-btn delete-btn"
                                                />
                                            </div>
                                        )}
                                        <p>
                                            {t('subject_label')}:{' '}
                                            <b>
                                                {
                                                    schedule.schedule.lesson
                                                        .subjectForSite
                                                }
                                                (
                                                {
                                                    schedule.schedule.lesson
                                                        .lessonType
                                                }
                                                )
                                            </b>
                                        </p>
                                        <p>
                                            {t('room_label')}:{' '}
                                            <b>{schedule.schedule.room.name}</b>
                                        </p>
                                        <p>
                                            {t('teacher_label')}:{' '}
                                            <b>
                                                {
                                                    schedule.schedule.lesson
                                                        .teacherForSite
                                                }
                                            </b>
                                        </p>
                                        <p>
                                            {t('class')}:{' '}
                                            <b>
                                                {
                                                    schedule.schedule.class
                                                        .startTime
                                                }{' '}
                                                -{' '}
                                                {
                                                    schedule.schedule.class
                                                        .endTime
                                                }
                                            </b>
                                        </p>
                                        <p>
                                            {t('group_label')}:{' '}
                                            <b>
                                                {
                                                    schedule.schedule.lesson
                                                        .group.title
                                                }
                                            </b>
                                        </p>
                                    </Card>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        className="divider"
                                    />
                                    {schedule.temporary_schedule ? (
                                        <Card class="done-card">
                                            <div className="cards-btns">
                                                <FaEdit
                                                    title={t(
                                                        'delete_lesson_changes'
                                                    )}
                                                    className="svg-btn edit-btn"
                                                />
                                                <MdDelete
                                                    title={t(
                                                        'edit_lesson_lesson'
                                                    )}
                                                    className="svg-btn delete-btn"
                                                />
                                            </div>
                                            <p>
                                                Subject:{' '}
                                                <b>
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .lesson
                                                            .subjectForSite
                                                    }
                                                    (
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .lesson.lessonType
                                                    }
                                                    )
                                                </b>
                                            </p>
                                            <p>
                                                Room:{' '}
                                                <b>
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .room.name
                                                    }
                                                </b>
                                            </p>
                                            <p>
                                                Teacher:{' '}
                                                <b>
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .lesson
                                                            .teacherForSite
                                                    }
                                                </b>
                                            </p>
                                            <p>
                                                Period:{' '}
                                                <b>
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .class.startTime
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .class.endTime
                                                    }
                                                </b>
                                            </p>
                                            <p>
                                                Group:{' '}
                                                <b>
                                                    {
                                                        schedule
                                                            .temporary_schedule
                                                            .lesson.group.title
                                                    }
                                                </b>
                                            </p>
                                        </Card>
                                    ) : (
                                        <Card class="done-card hidden-card">
                                            Hidden
                                        </Card>
                                    )}
                                </section>
                            ))}
                        </section>
                    </section>
                ))
            ) : (
                <section className="centered-container">
                    <h2>{t('common:no_changes')}</h2>
                </section>
            )}
        </>
    );
};

export default TemporaryScheduleList;
