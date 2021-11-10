import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import './BusyRoomsPage.scss';
import { getClassScheduleListService } from '../../services/classService';
import BusyRoomsTable from './BustRoomsTable/BusyRoomsTable';
import {
    COMMON_TABLE_COLUMNS_SIZE,
    COMMON_TABLE_COLUMNS_SIZE_SMALL,
    COMMON_TABLE_COLUMNS_SIZE_BASE,
    COMMON_TABLE_COLUMNS_SIZE_LARGE,
} from '../../constants/translationLabels/common';

const BusyRoomsPage = (props) => {
    const {
        currentSemester,
        getAllScheduleItems,
        busyRooms,
        getBusyRooms,
        setScheduleLoading,
        scheduleLoading,
    } = props;
    const { t } = useTranslation('common');
    const [columnsSize, setColumnsSize] = useState(
        localStorage.getItem('roomsTableColumnsSize') || 'base',
    );

    useEffect(() => {
        setScheduleLoading(true);
        getBusyRooms();
        getAllScheduleItems();
        getClassScheduleListService();
    }, []);

    const handleChange = ({ target }) => {
        setColumnsSize(target.value);
        localStorage.setItem('roomsTableColumnsSize', target.value);
    };

    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    return (
        <section className="schedule-card busy-rooms-control-panel">
            {scheduleLoading || !get(busyRooms[0], 'schedules') ? (
                <CircularProgress />
            ) : (
                <>
                    <div className="table-size-container">
                        <FormControl component="div" class="radio-control">
                            <FormLabel component="legend">{`${t(
                                COMMON_TABLE_COLUMNS_SIZE,
                            )}:`}</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                className="radio-group"
                                value={columnsSize}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="sm"
                                    control={<Radio />}
                                    label={t(COMMON_TABLE_COLUMNS_SIZE_SMALL)}
                                />
                                <FormControlLabel
                                    value="base"
                                    control={<Radio />}
                                    label={t(COMMON_TABLE_COLUMNS_SIZE_BASE)}
                                />
                                <FormControlLabel
                                    value="lg"
                                    control={<Radio />}
                                    label={t(COMMON_TABLE_COLUMNS_SIZE_LARGE)}
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <BusyRoomsTable
                        days={days}
                        t={t}
                        columnsSize={columnsSize}
                        classes={classes}
                        busyRooms={busyRooms}
                    />
                </>
            )}
        </section>
    );
};

export default BusyRoomsPage;
