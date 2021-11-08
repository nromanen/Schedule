import React, { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import './BusyRoomsPage.scss';
import { getClassScheduleListService } from '../../services/classService';
import BusyRoomsTable from './BustRoomsTable/BusyRoomsTable';

const BusyRoomsPage = (props) => {
    const {
        currentSemester,
        getAllScheduleItems,
        busyRooms,
        getBusyRooms,
        setScheduleLoading,
        scheduleLoading,
    } = props;

    useEffect(() => {
        setScheduleLoading(true);
        getBusyRooms();
        getAllScheduleItems();
        getClassScheduleListService();
    }, []);

    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    return (
        <section className="busy-rooms-control-panel">
            {scheduleLoading || !get(busyRooms[0], 'schedules') ? (
                <CircularProgress />
            ) : (
                <BusyRoomsTable days={days} classes={classes} busyRooms={busyRooms} />
            )}
        </section>
    );
};

export default BusyRoomsPage;
