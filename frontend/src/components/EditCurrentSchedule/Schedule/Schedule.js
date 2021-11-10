import React, { useEffect, useState } from 'react';
import ScheduleBoard from '../../../containers/EditCurrentSchedule/ScheduleBoard';
import ScheduleDialog from '../../../containers/Dialogs/ScheduleDialog';
import ScheduleDaySidebar from '../../ScheduleTable/ScheduleDaySidebar/ScheduleDaySidebar';
import './Schedule.scss';

import {
    NO_CURRENT_SEMESTER,
    COMMON_GROUP_TITLE,
} from '../../../constants/translationLabels/common';
import { actionType } from '../../../constants/actionTypes';
import { addClassDayBoard, removeClassDayBoard } from '../../../helper/schedule';
import i18n from '../../../i18n';

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
        if (groupId) {
            const groupColumn = document.querySelector(`#group-${groupId}`);
            groupColumn.scrollIntoView({ inline: 'center' });
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

    return (
        <>
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
                    <ScheduleDaySidebar
                        days={days}
                        title={i18n.t(COMMON_GROUP_TITLE)}
                        classes={classes}
                    />
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
                                    <span className="group-title card sticky-container">
                                        {group.title}
                                    </span>
                                    {allLessons.map((lesson) => (
                                        <div
                                            key={`${group.id}-${lesson.id}-${lesson.week}`}
                                            className="board-container"
                                            onMouseOver={() =>
                                                addClassDayBoard(lesson.dayName, lesson.classId)
                                            }
                                            onFocus={() =>
                                                addClassDayBoard(lesson.dayName, lesson.classId)
                                            }
                                            onMouseOut={() =>
                                                removeClassDayBoard(lesson.dayName, lesson.classId)
                                            }
                                            onBlur={() =>
                                                removeClassDayBoard(lesson.dayName, lesson.classId)
                                            }
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
                                </div>
                            );
                        })}
                    </section>
                </>
            ) : (
                <h2 className="no-current-semester">{i18n.t(NO_CURRENT_SEMESTER)}</h2>
            )}
        </>
    );
};

export default Schedule;