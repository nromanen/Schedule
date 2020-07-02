import React from 'react';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';

const TemporaryScheduleCardButtons = props => {
    const { t } = useTranslation('common');

    const { schedule, date, isTemporary } = props;

    const selectTemporarySchedule = schedule => {
        console.log(schedule);
        selectTemporaryScheduleService({
            ...schedule.lesson,
            room: schedule.room,
            class: schedule.class,
            id: schedule.id,
            vacation: schedule.vacation,
            scheduleId: schedule.scheduleId,
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
            <MdDelete
                title={t('common:delete_hover_title')}
                className="svg-btn delete-btn"
            />
        </div>
    );
};

export default TemporaryScheduleCardButtons;
