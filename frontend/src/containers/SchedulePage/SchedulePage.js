import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { showAllGroupsService } from '../../services/groupService';
import { getLessonsByGroupService } from '../../services/lessonService';
import {
    setLoadingService,
    setScheduleLoadingService
} from '../../services/loadingService';
import { getClassScheduleListService } from '../../services/classService';
import { getScheduleItemsService } from '../../services/scheduleService';
import { showListOfRoomsService } from '../../services/roomService';

import ScheduleLessonsList from '../../components/ScheduleLessonsList/ScheduleLessonsList';
import Schedule from '../../components/Schedule/Schedule';

import { CircularProgress } from '@material-ui/core';

import './SchedulePage.scss';

const SchedulePage = props => {
    const { t } = useTranslation('common');

    document.title = t('schedule_title');

    const { groups, groupId } = props;

    const itemGroupId = props.itemGroupId;

    const scheduleItems = props.scheduleItems;

    let lessons = props.lessons;

    const isLoading = props.loading;

    useEffect(() => {
        setLoadingService(true);
        setScheduleLoadingService(true);
        getScheduleItemsService();
    }, []);

    useEffect(() => {
        showAllGroupsService();
    }, []);

    useEffect(() => {
        if (groupId) {
            setLoadingService(true);
            getLessonsByGroupService(groupId);
        }
    }, [groupId]);

    useEffect(() => getClassScheduleListService(), []);

    useEffect(() => showListOfRoomsService(), []);

    return (
        <>
            <section className="cards-container schedule-page">
                <section className="flexbox card ">
                    {props.scheduleLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {!props.currentSemester.id ? (
                                <h2 className="no-current-semester">
                                    {t('no_current_semester')}
                                </h2>
                            ) : (
                                <Schedule
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
                        <ScheduleLessonsList
                            items={scheduleItems}
                            groups={groups}
                            lessons={lessons}
                            groupId={groupId}
                            translation={t}
                            classScheduler={
                                props.currentSemester.semester_classes
                            }
                        />
                    )}
                </aside>
            </section>
            <section className="for-phones-and-tablets card">
                <h1>{t('use_pc')}</h1>
            </section>
        </>
    );
};

const mapStateToProps = state => ({
    groups: state.groups.groups,
    lessons: state.lesson.lessons,
    groupId: state.lesson.groupId,
    loading: state.loadingIndicator.loading,
    scheduleLoading: state.loadingIndicator.scheduleLoading,
    scheduleItems: state.schedule.items,
    itemGroupId: state.schedule.itemGroupId,
    availability: state.schedule.availability,
    currentSemester: state.schedule.currentSemester,
    rooms: state.rooms.rooms
});

export default connect(mapStateToProps)(SchedulePage);
