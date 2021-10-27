import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';

import { CircularProgress } from '@material-ui/core';
import { showAllGroupsService } from '../../services/groupService';
import { getLessonsByGroupService } from '../../services/lessonService';
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
import { clearScheduleStart, getAllScheduleItemsStart } from '../../actions/schedule';

const SchedulePage = (props) => {
    const {
        groups,
        groupId,
        itemGroupId,
        scheduleItems,
        lessons,
        isLoading,
        getAllScheduleItems,
        clearScheduleItems,
    } = props;
    const { t } = useTranslation('common');

    document.title = t(SCHEDULE_TITLE);

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
            getLessonsByGroupService(groupId);
        }
    }, [groupId]);

    const handleClearSchedule = () => {
        if (props.currentSemester.id) {
            clearScheduleItems(props.currentSemester.id);
            if (groupId) {
                setLoadingService(true);
                getLessonsByGroupService(groupId);
            }
        }
    };

    return (
        <>
            <section className="cards-container schedule-page">
                <section className="flexbox card ">
                    {props.scheduleLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {!props.currentSemester.id ? (
                                <h2 className="no-current-semester">{t(NO_CURRENT_SEMESTER)}</h2>
                            ) : (
                                <Schedule
                                    groupId={groupId}
                                    currentSemester={props.currentSemester}
                                    groups={groups}
                                    itemGroupId={itemGroupId}
                                    items={scheduleItems}
                                    translation={t}
                                    rooms={props.rooms}
                                    availability={props.availability}
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
                                items={scheduleItems}
                                groups={groups}
                                lessons={lessons}
                                groupId={groupId}
                                translation={t}
                                classScheduler={props.currentSemester.semester_classes}
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
    getAllScheduleItems: () => dispatch(getAllScheduleItemsStart()),
    clearScheduleItems: (id) => dispatch(clearScheduleStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
