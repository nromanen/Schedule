import React, { useEffect, useState, useMemo } from 'react';
import { CircularProgress } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useTranslation } from 'react-i18next';
import './BusyRoomsPage.scss';
import BusyRoomsTable from './BustRoomsTable/BusyRoomsTable';
import SemesterLegend from '../SemesterLegend/SemesterLegend';
import { COMMON_TABLE_COLUMNS_SIZE } from '../../constants/translationLabels/common';
import { columnSizeArray } from '../../constants/schedule/schedule';
import BusyRoomsLegend from "./BusyRoomsLegend/BusyRoomsLegend";
import {getWeekKeyForSemester, getWeekParity} from "../../utils/dateUtils";

const BusyRoomsPage = (props) => {
    const {
        getAllScheduleItems,
        getCombinedBusyRooms,
        combinedBusyRooms,     // { semesters: [], rooms: { [semesterId]: [...] } }
        getClassScheduleList,
        setScheduleLoading,
        scheduleLoading,
    } = props;

    const { t } = useTranslation('common');
    const [columnsSize, setColumnsSize] = useState(
        localStorage.getItem('roomsTableColumnsSize') || 'base',
    );
    const [activeSemesterIds, setActiveSemesterIds] = useState([]);

    useEffect(() => {
        setScheduleLoading(true);
        getCombinedBusyRooms();
        getAllScheduleItems();
        getClassScheduleList();
    }, []);

    useEffect(() => {
        if (combinedBusyRooms?.semesters?.length) {
            setActiveSemesterIds(combinedBusyRooms.semesters.map(s => s.id));
        }
    }, [combinedBusyRooms?.semesters]);

    const handleChange = ({ target }) => {
        setColumnsSize(target.value);
        localStorage.setItem('roomsTableColumnsSize', target.value);
    };

    const handleSemesterToggle = (semesterId) => {
        setActiveSemesterIds(prev =>
            prev.includes(semesterId)
                ? prev.filter(id => id !== semesterId)
                : [...prev, semesterId]
        );
    };

    const mergedBusyRooms = useMemo(() => {
        if (!combinedBusyRooms?.roomsBySemesterId || !combinedBusyRooms?.semesters) {
            return [];
        }

        const { semesters, roomsBySemesterId } = combinedBusyRooms;
        const activeSemesters = semesters.filter(s => activeSemesterIds.includes(s.id));
        if (!activeSemesters.length) return [];

        const referenceSemester = activeSemesters[0];
        const baseRooms = roomsBySemesterId[String(referenceSemester.id)] || [];

        if (activeSemesters.length === 1) return baseRooms;

        const result = JSON.parse(JSON.stringify(baseRooms));

        result.forEach(room => {
            room.schedules.forEach(schedule => {
                schedule.classes.forEach(cls => {
                    cls.even.forEach(slot => {
                        slot.lessons = slot.lessons.map(l => ({ ...l, _semesterIndex: 0 }));
                    });
                    cls.odd.forEach(slot => {
                        slot.lessons = slot.lessons.map(l => ({ ...l, _semesterIndex: 0 }));
                    });
                });
            });
        });

        const resultByRoomId = Object.fromEntries(result.map(r => [r.room_id, r]));

        activeSemesters.slice(1).forEach((semester, extraIndex) => {
            const getWeekKey = getWeekKeyForSemester(semester, { semester: referenceSemester });
            const semesterRooms = roomsBySemesterId[String(semester.id)] || [];

            semesterRooms.forEach(room => {
                const baseRoom = resultByRoomId[room.room_id];
                if (!baseRoom) return;

                const baseDayMap = Object.fromEntries(
                    baseRoom.schedules.map(d => [d.day, d])
                );

                room.schedules.forEach(schedule => {
                    if (baseDayMap[schedule.day]) {
                        const baseClasses = baseDayMap[schedule.day].classes[0];
                        const extraClasses = schedule.classes[0];

                        const evenKey = getWeekKey('even');
                        const oddKey = getWeekKey('odd');

                        const extraEven = extraClasses[evenKey] || [];
                        const extraOdd = extraClasses[oddKey] || [];

                        baseClasses.even.forEach(slot => {
                            const match = extraEven.find(s => s.class_id === slot.class_id);
                            if (match) {
                                const tagged = match.lessons.map(l => ({ ...l, _semesterIndex: extraIndex + 1 }));
                                slot.lessons.push(...tagged);
                            }
                        });

                        baseClasses.odd.forEach(slot => {
                            const match = extraOdd.find(s => s.class_id === slot.class_id);
                            if (match) {
                                const tagged = match.lessons.map(l => ({ ...l, _semesterIndex: extraIndex + 1 }));
                                slot.lessons.push(...tagged);
                            }
                        });
                    } else {
                        baseRoom.schedules.push(schedule);
                        baseRoom.schedules.sort((a, b) =>
                            ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
                                .indexOf(a.day) -
                            ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
                                .indexOf(b.day)
                        );
                    }
                });
            });
        });

        return result;
    }, [combinedBusyRooms, activeSemesterIds]);

    const semesters = combinedBusyRooms?.semesters || [];

    const days = semesters[0]?.semester_days || [];
    const classes = semesters[0]?.semester_classes || [];

    const isLoading = scheduleLoading || !combinedBusyRooms?.semesters;

    return (
        <section className="schedule-card busy-rooms-control-panel">
            {isLoading ? (
                <CircularProgress className="loading-circle" />
            ) : (
                <>
                    <div className="table-size-container">
                        <FormControl component="div" className="radio-control">
                            <FormLabel component="legend">{`${t(COMMON_TABLE_COLUMNS_SIZE)}:`}</FormLabel>
                            <RadioGroup
                                aria-label="columns-size"
                                className="radio-group"
                                value={columnsSize}
                                onChange={handleChange}
                            >
                                {columnSizeArray.map((item) => (
                                    <FormControlLabel
                                        key={item.value}
                                        value={item.value}
                                        control={<Radio />}
                                        label={t(item.label)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <SemesterLegend
                            semesters={semesters}
                            activeSemesterIds={activeSemesterIds}
                            onToggle={handleSemesterToggle}
                        />
                        <BusyRoomsLegend />
                    </div>
                    <BusyRoomsTable
                        days={days}
                        t={t}
                        columnsSize={columnsSize}
                        classes={classes}
                        busyRooms={mergedBusyRooms}
                        activeSemesterIds={activeSemesterIds}
                    />
                </>
            )}
        </section>
    );
};

export default BusyRoomsPage;