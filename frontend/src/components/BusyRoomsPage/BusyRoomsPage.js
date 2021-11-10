import React, { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    return (
        <section className="busy-rooms-control-panel">
            {scheduleLoading || !get(busyRooms[0], 'schedules') ? (
                <CircularProgress />
            ) : (
                <>
                    <div className="table-size-container">
                        <FormControl component="fieldset" class="radio-control">
                            <FormLabel component="legend">table cell size</FormLabel>
                            <RadioGroup
                                aria-label="gender"
                                name="gender1"
                                className="radio-group"
                                value={value}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="base" control={<Radio />} label="base" />
                                <FormControlLabel value="small" control={<Radio />} label="small" />
                                <FormControlLabel value="large" control={<Radio />} label="large" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <BusyRoomsTable days={days} classes={classes} busyRooms={busyRooms} />
                </>
            )}
        </section>
    );
};

export default BusyRoomsPage;
