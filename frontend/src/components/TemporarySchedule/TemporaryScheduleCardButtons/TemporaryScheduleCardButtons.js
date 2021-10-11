import React from 'react';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';
import {
    COMMON_EDIT_HOVER_TITLE,
    COMMON_DELETE_HOVER_TITLE,
} from '../../../constants/translationLabels';

const TemporaryScheduleCardButtons = (props) => {
    const { t } = useTranslation('common');

    const { schedule, date, isTemporary, scheduleId } = props;
    const { onOpenDialog, setDate, setTeacherId } = props;

    const selectTemporarySchedule = (schedule) => {
        selectTemporaryScheduleService({
            ...schedule.lesson,
            room: schedule.room,
            class: schedule.class,
            id: schedule.id,
            vacation: schedule.vacation,
            scheduleId: schedule.scheduleId ? schedule.scheduleId : scheduleId,
            date: schedule.date,
        });
    };

    const handleScheduleSelect = (schedule) => {
        schedule.scheduleId = schedule.id;
        schedule.id = null;
        schedule.lesson.id = null;
        selectTemporarySchedule(schedule);
    };

    return (
        <div className="cards-btns">
            <FaEdit
                title={t(COMMON_EDIT_HOVER_TITLE)}
                className="svg-btn edit-btn"
                onClick={() => {
                    isTemporary
                        ? selectTemporarySchedule({ ...schedule, date })
                        : handleScheduleSelect({
                              ...schedule,
                              date,
                          });
                }}
            />
            {isTemporary && (
                <MdDelete
                    title={t(COMMON_DELETE_HOVER_TITLE)}
                    className="svg-btn delete-btn"
                    onClick={() => {
                        onOpenDialog(schedule.id);
                        setDate(date);
                        setTeacherId(schedule.lesson.teacher.id);
                    }}
                />
            )}
        </div>
    );
};

export default TemporaryScheduleCardButtons;
