import React from 'react';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';

const TemporaryScheduleCardButtons = props => {
    const { t } = useTranslation('common');

    const { schedule, date, isTemporary } = props;

    const selectTemporarySchedule = schedule => {
        selectTemporaryScheduleService({
            ...schedule.lesson,
            room: schedule.room,
            class: schedule.class,
            id: schedule.id,
            vacation: schedule.vacation,
            scheduleId: schedule.scheduleId
                ? schedule.scheduleId
                : props.scheduleId,
            date: schedule.date
        });
    };

    const handleScheduleSelect = schedule => {
        schedule.lesson.id = null;
        schedule.scheduleId = schedule.id;
        selectTemporarySchedule(schedule);
    };

    return (
        <div className="cards-btns">
            <FaEdit
                title={t('common:edit_hover_title')}
                className="svg-btn edit-btn"
                onClick={() => {
                    isTemporary
                        ? selectTemporarySchedule({ ...schedule, date: date })
                        : handleScheduleSelect({
                              ...schedule,
                              date: date
                          });
                }}
            />
            {isTemporary && (
                <MdDelete
                    title={t('common:delete_hover_title')}
                    className="svg-btn delete-btn"
                    onChange={() => {
                        props.openDialog(schedule.id);
                        props.setDate(date);
                        props.setTeacherId(schedule.teacher.id);
                    }}
                />
            )}
        </div>
    );
};

export default TemporaryScheduleCardButtons;
