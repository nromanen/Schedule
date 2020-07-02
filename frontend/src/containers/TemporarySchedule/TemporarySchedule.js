import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TemporaryScheduleForm from '../../components/TemporarySchedule/TemporaryScheduleForm/TemporaryScheduleForm';
import ScheduleAndTemporaryScheduleList from '../../components/TemporarySchedule/ScheduleAndTemporaryScheduleList/ScheduleAndTemporaryScheduleList';
import TemporaryScheduleTitle from '../../components/TemporarySchedule/TemporaryScheduleTitle/TemporaryScheduleTitle';

import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '../../share/Card/Card';

import { setLoadingService } from '../../services/loadingService';
import { showAllTeachersService } from '../../services/teacherService';
import { addTemporaryScheduleService } from '../../services/temporaryScheduleService';

import './TemporarySchedule.scss';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';
import { showAllSubjectsService } from '../../services/subjectService';
import { getLessonTypesService } from '../../services/lessonService';
import TemporaryScheduleList from '../../components/TemporarySchedule/TemporaryScheduleList/TemporaryScheduleList';
import TemporaryScheduleVacationForm from '../../components/TemporarySchedule/TemporaryScheduleVacationForm/TemporaryScheduleVacationForm';
import { showAllGroupsService } from '../../services/groupService';

const TemporarySchedule = props => {
    const { t } = useTranslation('common');

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const isLoading = props.loading;

    const { teachers, teacherId } = props;
    useEffect(() => {
        setLoadingService(true);
        showAllTeachersService();
        showListOfRoomsService();
        showAllSubjectsService();
        getClassScheduleListService(null);
        getLessonTypesService();
        showAllGroupsService();
    }, []);

    const handleTemporaryScheduleSubmit = values => {
        addTemporaryScheduleService(teacherId, values);
    };

    const handleTemporaryScheduleVacationSubmit = values => {
        addTemporaryScheduleService(teacherId, { ...values, vacation: true });
    };

    return (
        <>
            <Card class="card-title lesson-card">
                <h1 className="page-h">
                    {t('temporary_schedule_for_teacher_title')}
                </h1>
                <TemporaryScheduleTitle
                    teacherId={teacherId}
                    teachers={teachers}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                />
            </Card>
            <div className="cards-container">
                <aside>
                    {props.temporarySchedule.id ? (
                        <TemporaryScheduleForm
                            temporarySchedule={props.temporarySchedule}
                            teacherRangeSchedule={props.teacherRangeSchedule}
                            teacherId={teacherId}
                            onSubmit={handleTemporaryScheduleSubmit}
                            lessonTypes={props.lessonTypes}
                            teachers={teachers}
                            rooms={props.rooms}
                            periods={props.periods}
                            subjects={props.subjects}
                            groups={props.groups}
                        />
                    ) : (
                        <TemporaryScheduleVacationForm
                            teachers={teachers}
                            onSubmit={handleTemporaryScheduleVacationSubmit}
                            teacherId={teacherId}
                        />
                    )}
                </aside>
                {isLoading ? (
                    <section className="centered-container">
                        <CircularProgress />
                    </section>
                ) : (
                    <>
                        {props.schedulesAndTemporarySchedules.length > 0 && (
                            <ScheduleAndTemporaryScheduleList
                                schedulesAndTemporarySchedules={
                                    props.schedulesAndTemporarySchedules
                                }
                            />
                        )}
                        {props.temporarySchedules.length > 0 && (
                            <TemporaryScheduleList
                                temporarySchedules={props.temporarySchedules}
                            />
                        )}
                    </>
                )}
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    schedulesAndTemporarySchedules:
        state.temporarySchedule.schedulesAndTemporarySchedules,
    temporarySchedules: state.temporarySchedule.temporarySchedules,
    temporarySchedule: state.temporarySchedule.temporarySchedule,
    lessonTypes: state.lesson.lessonTypes,
    subjects: state.subjects.subjects,
    rooms: state.rooms.rooms,
    periods: state.classActions.classScheduler,
    groups: state.groups.groups,
    loading: state.loadingIndicator.loading,
    teachers: state.teachers.teachers,
    teacherId: state.temporarySchedule.teacherId
});

export default connect(mapStateToProps)(TemporarySchedule);
