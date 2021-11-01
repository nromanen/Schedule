import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { showAllGroupsService } from '../../services/groupService';
import { setLoadingService, setScheduleLoadingService } from '../../services/loadingService';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';

import ScheduleLessonsList from '../ScheduleLessonsList/ScheduleLessonsList';
import Schedule from '../../containers/EditCurrentSchedule/Schedule';

import './EditCurrentSchedule.scss';
import {
    SCHEDULE_TITLE,
    CLEAR_SCHEDULE_LABEL,
    USE_PC,
} from '../../constants/translationLabels/common';

const SchedulePage = (props) => {
    const {
        groups,
        groupId,
        itemGroupId,
        scheduleItems,
        lessons,
        isLoading,
        availability,
        scheduleLoading,
        getAllLessonsByGroup,
        getAllScheduleItems,
        clearScheduleItems,
        currentSemester,
    } = props;
    const [dragItemData, setDragItemData] = useState({});
    const { t } = useTranslation('common');
    const days = currentSemester.semester_days || [];
    const classes = currentSemester.semester_classes || [];
    const allLessons = [];
    document.title = t(SCHEDULE_TITLE);

    days.forEach((day, outerIndex) => {
        classes.forEach((classNumber, index) => {
            allLessons.push(
                {
                    dayName: day,
                    classId: classNumber.id,
                    week: 'ODD',
                    id: `${index}-${outerIndex}`,
                },
                {
                    dayName: day,
                    classId: classNumber.id,
                    week: 'EVEN',
                    id: `${index}-${outerIndex}`,
                },
            );
        });
    });

    useEffect(() => {
        setLoadingService(true);
        setScheduleLoadingService(true);
        getAllScheduleItems();
        showAllGroupsService();
        showListOfRoomsService();
        getClassScheduleListService();
    }, []);

    useEffect(() => {
        if (groupId) {
            setLoadingService(true);
            getAllLessonsByGroup(groupId);
        }
    }, [groupId]);

    const handleClearSchedule = () => {
        if (currentSemester.id) {
            clearScheduleItems(currentSemester.id);
            if (groupId) {
                setLoadingService(true);
                getAllLessonsByGroup(groupId);
            }
        }
    };
    return (
        <>
            <section className="schedule-control-panel">
                <section className="card schedule-table ">
                    {scheduleLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Schedule
                                dragItemData={dragItemData}
                                groupId={groupId}
                                currentSemester={currentSemester}
                                groups={groups}
                                itemGroupId={itemGroupId}
                                items={scheduleItems}
                                allLessons={allLessons}
                                availability={availability}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </section>
                <aside className="lesson-list card">
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Button
                                className="buttons-style"
                                variant="contained"
                                color="primary"
                                onClick={() => handleClearSchedule()}
                            >
                                {t(CLEAR_SCHEDULE_LABEL)}
                            </Button>
                            <ScheduleLessonsList
                                setDragItemData={setDragItemData}
                                items={scheduleItems}
                                groups={groups}
                                lessons={lessons}
                                groupId={groupId}
                                translation={t}
                                classScheduler={currentSemester.semester_classes}
                            />
                        </>
                    )}
                </aside>
            </section>
            <section className="for-phones-and-tablets card">
                <h1>{t(USE_PC)}</h1>
            </section>
        </>
    );
};

export default SchedulePage;
