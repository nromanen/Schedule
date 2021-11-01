import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { showAllGroupsService } from '../../services/groupService';
import { setLoadingService, setScheduleLoadingService } from '../../services/loadingService';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';

import ScheduleLessonsList from '../../components/ScheduleLessonsList/ScheduleLessonsList';
import Schedule from '../../components/Schedule/Schedule';

import './SchedulePage.scss';
import {
    SCHEDULE_TITLE,
    NO_CURRENT_SEMESTER,
    CLEAR_SCHEDULE_LABEL,
    USE_PC,
} from '../../constants/translationLabels/common';
import { getLessonsByGroup } from '../../actions';
import { clearScheduleStart, getAllScheduleItemsStart } from '../../actions/schedule';

const SchedulePage = (props) => {
    const {
        groups,
        groupId,
        itemGroupId,
        scheduleItems,
        lessons,
        isLoading,
        rooms,
        availability,
        scheduleLoading,
        getAllLessonsByGroup,
        getAllScheduleItems,
        clearScheduleItems,
        currentSemester,
    } = props;
    const [dragItemData, setDragItemData] = useState({});
    const { t } = useTranslation('common');
    const allLessons = [];
    const days = currentSemester.semester_days || [];
    const classes = currentSemester.semester_classes || [];
    document.title = t(SCHEDULE_TITLE);

    const getAllLessons = () => {
        days.forEach((day, outerIndex) => {
            classes.forEach((classNumber, index) => {
                allLessons.push(
                    {
                        day: { name: day.toLowerCase() },
                        classNumber,
                        week: 'odd',
                        id: `${index}-${outerIndex}`,
                    },
                    {
                        day: { name: day.toLowerCase() },
                        classNumber,
                        week: 'even',
                        id: `${index}-${outerIndex}`,
                    },
                );
            });
        });
    };

    useEffect(() => {
        setLoadingService(true);
        setScheduleLoadingService(true);
        getAllScheduleItems();
        showAllGroupsService();
        showListOfRoomsService();
        getClassScheduleListService();
        getAllLessons();
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
    console.log(allLessons);
    return (
        <>
            <section className="schedule-control-panel">
                <section className="card schedule-table ">
                    {scheduleLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {!currentSemester.id ? (
                                <h2 className="no-current-semester">{t(NO_CURRENT_SEMESTER)}</h2>
                            ) : (
                                <Schedule
                                    dragItemData={dragItemData}
                                    groupId={groupId}
                                    currentSemester={currentSemester}
                                    groups={groups}
                                    itemGroupId={itemGroupId}
                                    items={scheduleItems}
                                    translation={t}
                                    rooms={rooms}
                                    availability={availability}
                                    isLoading={isLoading}
                                />
                            )}
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

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
    lessons: state.lesson.lessons,
    groupId: state.lesson.groupId,
    loading: state.loadingIndicator.loading,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    scheduleItems: state.schedule.items,
    itemGroupId: state.schedule.itemGroupId,
    availability: state.schedule.availability,
    currentSemester: state.schedule.currentSemester,
    semester: state.schedule.semester,
    rooms: state.rooms.rooms,
});

const mapDispatchToProps = (dispatch) => ({
    getAllLessonsByGroup: (groupId) => dispatch(getLessonsByGroup(groupId)),
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    clearScheduleItems: (id) => dispatch(clearScheduleStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
