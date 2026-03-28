import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ScheduleDialog from '../../../containers/Dialogs/ScheduleDialog';
import './MoveScheduleDialog.scss';
import {actionType} from "../../../constants/actionTypes";
import {moveScheduleItem} from "../../../sagas/schedule";

const WEEKS = ['ODD', 'EVEN'];

const MoveScheduleDialog = ({ open, onClose, itemData, currentSemester, scheduleItems, checkRoomAvailability, moveScheduleItem, t }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const { dayOfWeek: currentDay, evenOdd: currentWeek, period: currentPeriod, lesson } = itemData;
    const groupId = lesson.group.id;

    const days = currentSemester?.semester_days || [];
    const classes = currentSemester?.semester_classes || [];

    const isCurrentSlot = (day, classId, week) =>
        day === currentDay && classId === currentPeriod.id && week === currentWeek;

    const isOccupied = (day, classId, week) =>
        scheduleItems?.some(
            (item) =>
                item.lesson.group.id === groupId &&
                item.dayOfWeek === day &&
                item.period.id === classId &&
                item.evenOdd === week,
        );

    const grouped = {};
    days.forEach((day) => {
        classes.forEach((cls) => {
            const availableWeeks = WEEKS.filter(
                (week) => !isCurrentSlot(day, cls.id, week) && !isOccupied(day, cls.id, week),
            );
            if (availableWeeks.length > 0) {
                if (!grouped[day]) grouped[day] = [];
                grouped[day].push({ cls, availableWeeks });
            }
        });
    });

    const handleSlotClick = (day, classId, week) => {
        const moveObj = {
            id: itemData.id,
            dayOfWeek: day,
            periodId: classId,
            evenOdd: week,
            semesterId: lesson.semesterId,
        };
        // clearAvailability();
        checkRoomAvailability(moveObj);
        setSelectedSlot({ day, classId, week });
    };

    const handleRoomSelect = (roomId) => {
        moveScheduleItem({
            scheduleId: itemData.id,
            roomId,
            dayOfWeek: selectedSlot.day,
            periodId: selectedSlot.classId,
            evenOdd: selectedSlot.week,
        });
        setSelectedSlot(null);
        onClose();
    };

    return (
        <>
        <Dialog open={open} onClose={onClose} maxWidth="xs" PaperProps={{ style: { width: 320 } }}>
            <DialogTitle>{t('move_lesson')}</DialogTitle>
            <DialogContent className="move-dialog-content">
                {Object.keys(grouped).length === 0 ? (
                    <p className="move-no-slots">Немає вільних слотів</p>
                ) : (
                    Object.entries(grouped).map(([day, periods]) => (
                        <div key={day} className="move-day-group">
                            <p className="move-day-title">{t(`day_of_week_${day}`)}</p>
                            {periods.map(({ cls, availableWeeks }) => (
                                <div key={cls.id} className="move-period-row">
                                    <span className="move-period-name">{t('class_schedule')} {cls.class_name}</span>
                                    <div className="move-week-chips">
                                        {WEEKS.map((week) => (
                                            availableWeeks.includes(week) ? (
                                                <button
                                                    key={week}
                                                    className="move-week-chip"
                                                    onClick={() => handleSlotClick(day, cls.id, week)}
                                                >
                                                    {t(`week_${week.toLowerCase()}_title`)}
                                                </button>
                                            ) : (
                                                <div key={week} className="move-week-chip-placeholder" />
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} >
                    {t('cancel_button_label')}
                </Button>
            </DialogActions>
        </Dialog>

    {selectedSlot && (
        <ScheduleDialog
            open={Boolean(selectedSlot)}
            onClose={() => setSelectedSlot(null)}
            itemData={{ type: actionType.MOVE, item: selectedSlot }}
            handleChangeSchedule={handleRoomSelect}
            initialRoom={itemData.room}
            currentRoom={itemData.room}
            t={t}
        />
    )}
        </>
    );
};

export default MoveScheduleDialog;