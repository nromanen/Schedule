import React, { Fragment, useEffect, useState } from 'react';
import i18n from 'i18next';
import ScheduleBoard from '../../../containers/EditCurrentSchedule/ScheduleBoard';
import ScheduleDialog from '../../../containers/Dialogs/ScheduleDialog';

import { cssClasses } from '../../../constants/schedule/cssClasses';
import { colors } from '../../../constants/schedule/colors';
import { FORM_DAY_LABEL } from '../../../constants/translationLabels/formElements';
import {
    SCHEDULE_TITLE,
    NO_CURRENT_SEMESTER,
    CLEAR_SCHEDULE_LABEL,
} from '../../../constants/translationLabels/common';
import { actionType } from '../../../constants/actionTypes';
import './Schedule.scss';

const Schedule = (props) => {
    const {
        groups,
        dragItemData,
        groupId,
        currentSemester,
        allLessons,
        selectedGroupById,
        getLessonsByGroupId,
        addItemsToSchedule,
        editRoomItemToSchedule,
    } = props;
    const [isOpenScheduleDialog, setIsOpenScheduleDialog] = useState(false);
    const [dialogScheduleData, setDialogScheduleData] = useState(null);
    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    useEffect(() => {
        if (groupId !== null) {
            const groupColumn = document.getElementById(`group-${groupId}`);
            groupColumn.scrollIntoView({ block: 'center', inline: 'center' });
        }
    }, [groupId]);

    const openScheduleDialogWithData = (data) => {
        setDialogScheduleData(data);
        setIsOpenScheduleDialog(true);
    };

    const handleChangeSchedule = (roomId, actionData) => {
        const { item, type } = actionData;
        setIsOpenScheduleDialog(false);
        if (type === actionType.UPDATED) {
            editRoomItemToSchedule({ itemId: item.id, roomId });
        } else {
            addItemsToSchedule({ ...item, roomId });
        }
        selectedGroupById(actionData.groupId);
        getLessonsByGroupId(actionData.groupId);
    };

    const handleClose = () => {
        setIsOpenScheduleDialog(false);
    };

    const getDayColour = (index) => {
        return index % 2 ? 'dark-blue-day' : 'blue-day';
    };

    return (
        <div className="schedule">
            {isOpenScheduleDialog && (
                <ScheduleDialog
                    itemData={dialogScheduleData}
                    open={isOpenScheduleDialog}
                    handleChangeSchedule={handleChangeSchedule}
                    onClose={handleClose}
                />
            )}
            {currentSemester.id ? (
                <>
                    <aside className="day-classes-aside">
                        <div className="card group-title">Група</div>
                        {days.map((day, index) => (
                            <div className="cards-container day-container" key={day}>
                                <span className={`${getDayColour(index)} schedule-day card`}>
                                    {i18n.t(`day_of_week_${day}`)}
                                </span>
                                <div className="class-section">
                                    {classes.map((classScheduler) => (
                                        <Fragment key={classScheduler.id}>
                                            <div className="day-section">
                                                <span className="card schedule-class">
                                                    {classScheduler.class_name}
                                                </span>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>
                    <section className="groups-section ">
                        {groups.map((group) => {
                            const isSelectedGroup = group.id === groupId;
                            return (
                                <div
                                    key={`group-${group.id}`}
                                    className={`group-section ${
                                        isSelectedGroup ? 'selected-group' : ''
                                    }`}
                                    id={`group-${group.id}`}
                                >
                                    <span className="group-title card">{group.title}</span>
                                    {allLessons.map((lesson) => (
                                        <div
                                            key={`${group.id}-${lesson.id}-${lesson.week}`}
                                            className="board-container"
                                        >
                                            <ScheduleBoard
                                                lesson={lesson}
                                                groupId={group.id}
                                                currentSemester={currentSemester}
                                                openDialogWithData={openScheduleDialogWithData}
                                                dragItemData={dragItemData}
                                                isSelectedGroup={isSelectedGroup}
                                                additionClassName="card schedule-board"
                                            />
                                        </div>
                                    ))}
                                    <span className="group-title card">{group.title}</span>
                                </div>
                            );
                        })}
                    </section>
                </>
            ) : (
                <h2 className="no-current-semester">{i18n.t(NO_CURRENT_SEMESTER)}</h2>
            )}
        </div>
    );
};

export default Schedule;
