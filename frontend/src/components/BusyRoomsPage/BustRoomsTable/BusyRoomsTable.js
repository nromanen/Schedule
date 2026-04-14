import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './BusyRoomsTable.scss';
import TableItem from '../TableItem/TableItem';

const BusyRoomsTable = ({ busyRooms, days, classes, columnsSize, t: tProp }) => {
    const { t: tHook } = useTranslation('common');
    const t = tProp || tHook;
    const wrapperRef = useRef(null);

    const dayGroups = days.map(day => ({ day, count: classes.length }));
    const getDayLabel = (day) => t(`day_of_week_${day}`);
    const getDayColour = (index) => index % 2 ? 'dark-blue-day' : 'blue-day';

    const handleRoomEnter = useCallback((roomId) => {
        if (!wrapperRef.current) return;
        wrapperRef.current
            .querySelectorAll(`[data-room-id="${roomId}"]`)
            .forEach(el => el.classList.add('col-highlighted'));
    }, []);

    const handleRoomLeave = useCallback((roomId) => {
        if (!wrapperRef.current) return;
        wrapperRef.current
            .querySelectorAll(`[data-room-id="${roomId}"]`)
            .forEach(el => el.classList.remove('col-highlighted'));
    }, []);

    return (
        <div className="busy-rooms-grid-wrapper" ref={wrapperRef}>
            <table className="busy-rooms-grid">
                <thead>
                <tr>
                    <th  colSpan={2}>
                    </th>
                    {busyRooms.map(room => (
                        <th
                            key={room.room_id}
                            data-room-id={room.room_id}
                            className={`grid-room-header responsive-table-column-${columnsSize} schedule-card`}
                            title={`${room.room_name} (${room.room_type})`}
                            onMouseEnter={() => handleRoomEnter(room.room_id)}
                            onMouseLeave={() => handleRoomLeave(room.room_id)}
                        >
                            {room.room_name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {dayGroups.map((group, dayIndex) =>
                    classes.map((cls, clsIndex) => {
                        const isFirstOfDay = clsIndex === 0;
                        return (
                            <tr key={`${group.day}-${cls.id}`}>
                                {isFirstOfDay && (
                                    <td
                                        rowSpan={group.count}
                                        className={`grid-day-label ${getDayColour(dayIndex)}`}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {getDayLabel(group.day).split('').map((char, i) => (
                                                <span key={i}>{char}</span>
                                            ))}
                                        </div>
                                    </td>
                                )}
                                <td className="grid-class-label schedule-card">
                                    {cls.class_name}
                                </td>
                                {busyRooms.map(room => {
                                    const schedule = room.schedules.find(s => s.day === group.day);
                                    return (
                                        <td
                                            key={room.room_id}
                                            data-room-id={room.room_id}
                                            className={`grid-cell responsive-table-column-${columnsSize}`}
                                            onMouseEnter={() => handleRoomEnter(room.room_id)}
                                            onMouseLeave={() => handleRoomLeave(room.room_id)}
                                        >
                                            {schedule ? (
                                                <TableItem
                                                    index={`${group.day}-${cls.id}-${room.room_id}`}
                                                    classes={[cls]}
                                                    schedule={schedule}
                                                    columnsSize={columnsSize}
                                                />
                                            ) : (
                                                <div className="grid-cell-empty" />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};

export default BusyRoomsTable;