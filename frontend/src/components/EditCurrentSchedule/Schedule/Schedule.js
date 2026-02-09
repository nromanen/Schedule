import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import ScheduleBoard from '../../../containers/EditCurrentSchedule/ScheduleBoard';
import ScheduleDialog from '../../../containers/Dialogs/ScheduleDialog';
import ScheduleDaySidebar from '../../ScheduleTable/ScheduleDaySidebar/ScheduleDaySidebar';
import { CircularProgress } from '@material-ui/core';
import './Schedule.scss';

import { COMMON_GROUP_TITLE, NO_CURRENT_SEMESTER } from '../../../constants/translationLabels/common';
import { actionType } from '../../../constants/actionTypes';
import { addClassDayBoard, removeClassDayBoard } from '../../../helper/schedule';
import {setScheduleOperationLoading} from "../../../actions/loadingIndicator";

// Width of a single group column in pixels
const COLUMN_WIDTH = 150;

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
        scheduleOperationLoading,
        setScheduleOperationLoading,
        t,
    } = props;

    const [isOpenScheduleDialog, setIsOpenScheduleDialog] = useState(false);
    const [dialogScheduleData, setDialogScheduleData] = useState(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const containerRef = useRef(null);
    const listRef = useRef(null);

    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    // Update container width on mount and window resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };

        // Delay initial measurement to ensure DOM is ready
        const timer = setTimeout(updateWidth, 100);

        window.addEventListener('resize', updateWidth);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateWidth);
        };
    }, [currentSemester]);

    // Scroll to selected group when groupId changes
    useEffect(() => {
        if (groupId && listRef.current) {
            const groupIndex = groups.findIndex(g => g.id === groupId);
            if (groupIndex !== -1) {
                listRef.current.scrollToItem(groupIndex, 'center');
            }
        }
    }, [groupId, groups]);

    const openScheduleDialogWithData = (data) => {
        setDialogScheduleData(data);
        setIsOpenScheduleDialog(true);
    };

    // Handle schedule item update or creation
    const handleChangeSchedule = (roomId, actionData) => {
        const { item, type } = actionData;
        setIsOpenScheduleDialog(false);
        setScheduleOperationLoading(true);
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

    // Memoized column renderer for virtualized list
    const GroupColumn = useCallback(({ index, style }) => {
        const group = groups[index];
        const isSelectedGroup = group.id === groupId;
        const isLoading = isSelectedGroup && scheduleOperationLoading;

        return (
            <div
                style={style}
                key={`group-${group.id}`}
                className={`group-section ${isSelectedGroup ? 'selected-group' : ''} ${isLoading ? 'loading' : ''}`}
                id={`group-${group.id}`}
            >
                {isLoading && (
                    <div className="column-loading-overlay">
                        <CircularProgress size={40} />
                    </div>
                )}
                <span className="group-title schedule-card sticky-container">
                {group.title}
            </span>
                {allLessons.map((lesson) => (
                    <div
                        key={`${group.id}-${lesson.id}-${lesson.week}`}
                        className="board-container"
                        onMouseOver={() => addClassDayBoard(lesson.dayName, lesson.className)}
                        onMouseOut={() => removeClassDayBoard(lesson.dayName, lesson.className)}
                    >
                        <ScheduleBoard
                            lesson={lesson}
                            groupId={group.id}
                            currentSemester={currentSemester}
                            openDialogWithData={openScheduleDialogWithData}
                            dragItemData={dragItemData}
                            t={t}
                            isSelectedGroup={isSelectedGroup}
                            additionClassName="schedule-card schedule-board"
                        />
                    </div>
                ))}
            </div>
        );
    }, [groups, groupId, allLessons, currentSemester, dragItemData, t, scheduleOperationLoading]);

    const BOARD_CONTAINER_HEIGHT = 114; // Must match .board-container height in ScheduleBoard.scss
    const GROUP_TITLE_HEIGHT = 50;
    const listHeight = allLessons.length * BOARD_CONTAINER_HEIGHT + GROUP_TITLE_HEIGHT;

    return (
        <>
            {isOpenScheduleDialog && (
                <ScheduleDialog
                    itemData={dialogScheduleData}
                    open={isOpenScheduleDialog}
                    t={t}
                    handleChangeSchedule={handleChangeSchedule}
                    onClose={handleClose}
                />
            )}
            {currentSemester.id ? (
                <>
                    <ScheduleDaySidebar
                        days={days}
                        title={t(COMMON_GROUP_TITLE)}
                        classes={classes}
                    />
                    <section className="groups-section" ref={containerRef}>
                        <List
                            ref={listRef}
                            layout="horizontal"
                            height={listHeight}
                            width={containerWidth}
                            itemCount={groups.length}
                            itemSize={COLUMN_WIDTH}
                        >
                            {GroupColumn}
                        </List>
                    </section>
                </>
            ) : (
                <h2 className="no-current-semester">{t(NO_CURRENT_SEMESTER)}</h2>
            )}
        </>
    );
};

export default Schedule;