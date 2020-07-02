import React from 'react';
import { useTranslation } from 'react-i18next';

const TemporaryScheduleCard = props => {
    const { t } = useTranslation('formElements');
    const { schedule } = props;

    return (
        <>
            <p>
                {t('subject_label')}:{' '}
                <b>
                    {schedule.lesson.subjectForSite}(
                    {schedule.lesson.lessonType})
                </b>
            </p>
            <p>
                {t('room_label')}: <b>{schedule.room.name}</b>
            </p>
            <p>
                {t('teacher_label')}: <b>{schedule.lesson.teacherForSite}</b>
            </p>
            <p>
                {t('class')}:{' '}
                <b>
                    {schedule.class.startTime} - {schedule.class.endTime}
                </b>
            </p>
            <p>
                {t('group_label')}: <b>{schedule.lesson.group.title}</b>
            </p>
            <p>
                {t('semester_label')}:{' '}
                <b>{schedule.lesson.semester.description}</b>
            </p>
        </>
    );
};

export default TemporaryScheduleCard;
