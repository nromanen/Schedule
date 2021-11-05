import React, { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import './BusyRoomsPage.scss';
import { setLoadingService } from '../../services/loadingService';
import { getClassScheduleListService } from '../../services/classService';
import BusyRoomsTable from './BustRoomsTable/BusyRoomsTable';

const BusyRoomsPage = (props) => {
    const busyRooms = props.busyRooms[0];
    const { currentSemester, isLoading, getAllScheduleItems, roomTypes } = props;

    useEffect(() => {
        getAllScheduleItems();
        getClassScheduleListService();
        setLoadingService(true);
    }, []);
    let busyRoomsLength;
    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    if (busyRooms !== undefined) {
        busyRoomsLength = busyRooms.length;
    }

    if (isLoading) {
        return (
            <h2 className="busy-heading">
                <CircularProgress />
            </h2>
        );
    }
    return (
        <section className="busy-rooms-control-panel">
            {busyRoomsLength ? (
                <BusyRoomsTable
                    days={days}
                    classes={classes}
                    busyRooms={busyRooms}
                    busyRoomsLength={busyRoomsLength}
                />
            ) : null}
        </section>
    );
};

export default BusyRoomsPage;
