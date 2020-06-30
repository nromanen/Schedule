import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TemporaryScheduleForm from '../../components/TemporarySchedule/TemporaryScheduleForm/TemporaryScheduleForm';
import TemporaryScheduleList from '../../components/TemporarySchedule/TemporaryScheduleList/TemporaryScheduleList';
import TemporaryScheduleTitle from '../../components/TemporarySchedule/TemporaryScheduleTitle/TemporaryScheduleTitle';

import CircularProgress from '@material-ui/core/CircularProgress';

import Card from '../../share/Card/Card';

import { setLoadingService } from '../../services/loadingService';
import { showAllTeachersService } from '../../services/teacherService';
import {
    addTemporaryScheduleService,
    getTeacherTemporarySchedulesService
} from '../../services/temporaryScheduleService';

import './TemporarySchedule.scss';
import { makeStyles } from '@material-ui/core/styles';
import { showListOfRooms } from '../../redux/actions';
import { getClassScheduleListService } from '../../services/classService';
import { showListOfRoomsService } from '../../services/roomService';

const useStyles = makeStyles(() => ({
    notSelected: {
        '&': {
            textAlign: 'center',
            margin: 'auto'
        }
    }
}));

const TemporarySchedule = props => {
    const { t } = useTranslation('common');
    const classes = useStyles();

    const [isDateSelected, setIsDateSelected] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const isLoading = props.loading;

    const { teachers, teacherId } = props;
    useEffect(() => {
        setLoadingService(true);
        showAllTeachersService();
        showListOfRoomsService();
        getClassScheduleListService(null);
    }, []);

    const handleSubmit = values => {
        addTemporaryScheduleService(teacherId, values);
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
                    setIsDateSelected={setIsDateSelected}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                />
            </Card>
            <div className="cards-container">
                <aside>
                    {isDateSelected ? (
                        <TemporaryScheduleForm
                            temporarySchedule={props.temporarySchedule}
                            teacherRangeSchedule={props.teacherRangeSchedule}
                            teacherId={teacherId}
                            onSubmit={handleSubmit}
                            lessons={props.lessons}
                            lessonTypes={props.lessonTypes}
                            teachers={teachers}
                            rooms={props.rooms}
                            periods={props.periods}
                        />
                    ) : (
                        <Card class="form-card">
                            <div className={classes.notSelected}>
                                <h2>Date is not selected</h2>
                            </div>
                        </Card>
                    )}
                </aside>
                {isLoading ? (
                    <section className="centered-container">
                        <CircularProgress />
                    </section>
                ) : (
                    <main className="temporary-schedule-section">
                        <TemporaryScheduleList
                            temporarySchedules={props.temporarySchedules}
                        />
                    </main>
                )}
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    temporarySchedules: state.temporarySchedule.temporarySchedules,
    temporarySchedule: state.temporarySchedule.temporarySchedule,
    rooms: state.rooms.rooms,
    periods: state.classActions.classScheduler,
    loading: state.loadingIndicator.loading,
    teachers: state.teachers.teachers,
    teacherId: state.temporarySchedule.teacherId
});

export default connect(mapStateToProps)(TemporarySchedule);
