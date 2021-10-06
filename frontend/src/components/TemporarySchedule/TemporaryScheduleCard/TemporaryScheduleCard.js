import React from 'react';
import { useTranslation } from 'react-i18next';

const TemporaryScheduleCard = (props) => {
    const { t } = useTranslation('formElements');
    const { schedule } = props;

    return (
        <>
            <p>
                {t('subject_label')}:{' '}
                <b>
                    {schedule.lesson ? schedule.lesson.subjectForSite : schedule.subjectForSite}(
                    {schedule.lesson ? schedule.lesson.lessonType : schedule.lessonType})
                </b>
            </p>
            <p>
                {t('room_label')}: <b>{schedule.room.name}</b>
            </p>
            <p>
                {t('teacher_label')}:{' '}
                <b>{schedule.lesson ? schedule.lesson.teacherForSite : schedule.teacherForSite}</b>
            </p>
            <p>
                {t('common:class_schedule')}:{' '}
                <b>
                    {schedule.class.startTime} - {schedule.class.endTime}
                </b>
            </p>
            <p>
                {t('group_label')}:{' '}
                <b>{schedule.lesson ? schedule.lesson.group.title : schedule.group.title}</b>
            </p>
            <p>
                {t('semester_label')}:{' '}
                <b>
                    {schedule.lesson
                        ? schedule.lesson.semester.description
                        : schedule.semester.description}
                </b>
            </p>
        </>
    );
};

export default TemporaryScheduleCard;
