import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { CircularProgress } from '@material-ui/core';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';

import ScheduleLessonsList from '../../containers/EditCurrentSchedule/ScheduleLessonsList';
import Schedule from '../../containers/EditCurrentSchedule/Schedule';
import { SCHEDULE_TITLE, USE_PC } from '../../constants/translationLabels/common';
import { EDIT_SCHEDULE_MIN_WINDOW_SIZE } from '../../constants/windowSizes';
import './EditCurrentSchedule.scss';

const SchedulePage = (props) => {
    const {
        groupId,
        itemGroupId,
        scheduleItems,
        fetchEnabledGroupsStart,
        scheduleLoading,
        setScheduleLoading,
        getAllLessonsByGroup,
        getAllScheduleItems,
        clearScheduleItems,
        currentSemester,
    } = props;
    document.title = i18n.t(SCHEDULE_TITLE);
    const [dragItemData, setDragItemData] = useState({});
    const [isHiddenSchedule, setIsHiddenSchedule] = useState(false);
    const days = currentSemester.semester_days || [];
    const classes = currentSemester.semester_classes || [];
    const allLessons = [];

    const handleResize = () => {
        if (window.innerWidth < EDIT_SCHEDULE_MIN_WINDOW_SIZE) {
            setIsHiddenSchedule(true);
        } else {
            setIsHiddenSchedule(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);

    days.forEach((day, outerIndex) => {
        classes.forEach((classNumber, index) => {
            allLessons.push(
                {
                    dayName: day,
                    classId: classNumber.id,
                    className: classNumber.class_name,
                    week: 'ODD',
                    id: `${index}-${outerIndex}`,
                },
                {
                    dayName: day,
                    classId: classNumber.id,
                    className: classNumber.class_name,
                    week: 'EVEN',
                    id: `${index}-${outerIndex}`,
                },
            );
        });
    });

    useEffect(() => {
        setScheduleLoading(true);
        getAllScheduleItems();
        fetchEnabledGroupsStart();
        showListOfRoomsService();
        getClassScheduleListService();
    }, []);

    useEffect(() => {
        if (groupId) {
            getAllLessonsByGroup(groupId);
        }
    }, [groupId]);

    const handleClearSchedule = () => {
        if (currentSemester.id) {
            clearScheduleItems(currentSemester.id);
            if (groupId) {
                getAllLessonsByGroup(groupId);
            }
        }
    };
    if (isHiddenSchedule) {
        return (
            <section className="for-phones-and-tablets card">
                <h1>{i18n.t(USE_PC)}</h1>
            </section>
        );
    }
    return (
        <>
            <section className="schedule-control-panel">
                <section className="card schedule-table ">
                    {scheduleLoading ? (
                        <CircularProgress className="loading-circle" />
                    ) : (
                        <>
                            <Schedule
                                dragItemData={dragItemData}
                                groupId={groupId}
                                currentSemester={currentSemester}
                                itemGroupId={itemGroupId}
                                items={scheduleItems}
                                allLessons={allLessons}
                            />
                        </>
                    )}
                </section>
                <aside className="card lesson-list">
                    <ScheduleLessonsList
                        setDragItemData={setDragItemData}
                        items={scheduleItems}
                        handleClearSchedule={handleClearSchedule}
                        groupId={groupId}
                        classScheduler={currentSemester.semester_classes}
                    />
                </aside>
            </section>
        </>
    );
};

export default SchedulePage;
