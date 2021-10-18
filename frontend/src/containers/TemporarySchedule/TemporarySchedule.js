import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import TemporaryScheduleForm from '../../components/TemporarySchedule/TemporaryScheduleForm/TemporaryScheduleForm';
import ScheduleAndTemporaryScheduleList from '../../components/TemporarySchedule/ScheduleAndTemporaryScheduleList/ScheduleAndTemporaryScheduleList';
import TemporaryScheduleTitle from '../../components/TemporarySchedule/TemporaryScheduleTitle/TemporaryScheduleTitle';
import TemporaryScheduleList from '../../components/TemporarySchedule/TemporaryScheduleList/TemporaryScheduleList';
import TemporaryScheduleVacationForm from '../../components/TemporarySchedule/TemporaryScheduleVacationForm/TemporaryScheduleVacationForm';
import Card from '../../share/Card/Card';
import { setLoadingService } from '../../services/loadingService';
import { showAllTeachersService } from '../../services/teacherService';
import {
    addTemporaryScheduleForRangeService,
    addTemporaryScheduleService,
    editTemporaryScheduleService,
} from '../../services/temporaryScheduleService';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';
import { showAllSubjectsService } from '../../services/subjectService';
import { getLessonTypesService } from '../../services/lessonService';
import { showAllGroupsService } from '../../services/groupService';
import './TemporarySchedule.scss';
import { EMPTY_LABEL } from '../../constants/translationLabels/common';

const TemporarySchedule = (props) => {
    const { t } = useTranslation('common');
    const { teachers, teacherId, isLoading } = props;
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    useEffect(() => {
        setLoadingService(true);
        showAllTeachersService();
        showListOfRoomsService();
        showAllSubjectsService();
        getClassScheduleListService(null);
        getLessonTypesService();
        showAllGroupsService();
    }, []);

    const handleTemporaryScheduleSubmit = (values) => {
        if (values.id) editTemporaryScheduleService(teacherId, values);
        else addTemporaryScheduleService(teacherId, values, false);
    };

    const handleTemporaryScheduleVacationSubmit = (values) => {
        const addVacation = { ...values, vacation: true };
        if (!values.from && !values.to && values.id)
            editTemporaryScheduleService(teacherId, addVacation, true);
        else if (!values.from && !values.to && !values.id)
            addTemporaryScheduleService(teacherId, addVacation, true);
        else {
            addTemporaryScheduleForRangeService(teacherId, addVacation, true);
        }
    };

    return (
        <>
            <Card additionClassName="card-title lesson-card">
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
                    {props.temporarySchedule.id || props.temporarySchedule.scheduleId ? (
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
                            vacation={props.vacation}
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
                            <TemporaryScheduleList temporarySchedules={props.temporarySchedules} />
                        )}
                        {props.schedulesAndTemporarySchedules.length === 0 &&
                            props.temporarySchedules.length === 0 && (
                                <section className="centered-container">
                                    <h2>{t(EMPTY_LABEL)}</h2>
                                </section>
                            )}
                    </>
                )}
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    schedulesAndTemporarySchedules: state.temporarySchedule.schedulesAndTemporarySchedules,
    temporarySchedules: state.temporarySchedule.temporarySchedules,
    temporarySchedule: state.temporarySchedule.temporarySchedule,
    vacation: state.temporarySchedule.vacation,
    lessonTypes: state.lesson.lessonTypes,
    subjects: state.subjects.subjects,
    rooms: state.rooms.rooms,
    periods: state.classActions.classScheduler,
    groups: state.groups.groups,
    loading: state.loadingIndicator.loading,
    teachers: state.teachers.teachers,
    teacherId: state.temporarySchedule.teacherId,
});

export default connect(mapStateToProps)(TemporarySchedule);
