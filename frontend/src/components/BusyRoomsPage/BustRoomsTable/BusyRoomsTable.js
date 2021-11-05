import React from 'react';
import i18n from 'i18next';
import './BusyRoomsTable.scss';
import TableItem from '../TableItem/TableItem';
import ScheduleDaySidebar from '../../ScheduleTable/ScheduleDaySidebar/ScheduleDaySidebar';
import { ROOM_LIST_TITLE } from '../../../constants/translationLabels/common';

const BusyRoomsTable = (props) => {
    const { busyRooms, days, classes } = props;

    // const getTitleColorByRoomType = (roomType) => {
    //     const type = roomType.toLowerCase();
    //     switch (type) {
    //         case 'лекційна':
    //             return 'dd';
    //         case 'лабораторія':
    //             return 'aa';
    //         default:
    //             return 'ff';
    //     }
    // };
    return (
        <section className="card busy-rooms-table-container">
            <ScheduleDaySidebar title={i18n.t(ROOM_LIST_TITLE)} days={days} classes={classes} />
            <section className="view-rooms">
                {busyRooms.map((busyRoom) => (
                    <div className="busy-room-section" key={busyRoom.room_id}>
                        <span className="busy-room-title card sticky-container">
                            {busyRoom.room_name}
                            <span className="type-word">{busyRoom.room_type}</span>
                        </span>
                        {busyRoom.schedules.map((schedule, index) => {
                            return days.includes(schedule.day) ? (
                                <TableItem
                                    key={index.toString() + busyRoom.room_id}
                                    index={index.toString() + busyRoom.room_id}
                                    classes={classes}
                                    schedule={schedule}
                                />
                            ) : null;
                        })}
                    </div>
                ))}
            </section>
        </section>
    );
};
export default BusyRoomsTable;
