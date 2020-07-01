import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';

const ScheduleAndTemporaryScheduleList = props => {
    const { t } = useTranslation('formElements');

    const shortId = require('shortid');

    const schedulesAndTemporarySchedules =
        props.schedulesAndTemporarySchedules || [];

    const selectTemporarySchedule = schedule => {
        selectTemporaryScheduleService({
            ...schedule.lesson,
            room: schedule.room,
            class: schedule.class,
            id: schedule.id,
            vacation: schedule.vacation,
            scheduleId: schedule.scheduleId
        });
    };

    const handleScheduleSelect = schedule => {
        schedule.lesson.id = null;
        schedule.scheduleId = schedule.id;
        selectTemporarySchedule(schedule);
    };

    return (
        <main className="temporary-schedule-section">
            {schedulesAndTemporarySchedules.map(
                scheduleAndTemporarySchedule => (
                    <section className="card" key={shortId.generate()}>
                        <section className="centered-container">
                            <h2>{scheduleAndTemporarySchedule.date}</h2>
                        </section>
                        <Divider />
                        <section className="temporary-schedule-list">
                            {scheduleAndTemporarySchedule.schedules.map(
                                schedule => (
                                    <section
                                        className="temporary-schedule-row"
                                        key={shortId.generate()}
                                    >
                                        <Card class="done-card text-center">
                                            {!schedule.temporary_schedule && (
                                                <div className="cards-btns">
                                                    <FaEdit
                                                        title={t(
                                                            'common:edit_hover_title'
                                                        )}
                                                        className="svg-btn edit-btn"
                                                        onClick={() =>
                                                            handleScheduleSelect(
                                                                schedule.schedule
                                                            )
                                                        }
                                                    />
                                                    <MdDelete
                                                        title={t(
                                                            'common:delete_hover_title'
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
                                                <b>
                                                    {
                                                        schedule.schedule.room
                                                            .name
                                                    }
                                                </b>
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
                                                            'common:edit_hover_title'
                                                        )}
                                                        className="svg-btn edit-btn"
                                                        onClick={() =>
                                                            selectTemporarySchedule(
                                                                schedule.temporary_schedule
                                                            )
                                                        }
                                                    />
                                                    <MdDelete
                                                        title={t(
                                                            'common:delete_hover_title'
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
                                                                .lesson
                                                                .lessonType
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
                                                                .lesson.group
                                                                .title
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
                                )
                            )}
                        </section>
                    </section>
                )
            )}
        </main>
    );
};

export default ScheduleAndTemporaryScheduleList;
