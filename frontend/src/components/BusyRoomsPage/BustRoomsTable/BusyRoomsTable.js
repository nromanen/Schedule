import React from 'react';
import { useTranslation } from 'react-i18next';
import './BusyRoomsTable.scss';
import TableItem from '../TableItem/TableItem';
import ScheduleDaySidebar from '../../ScheduleTable/ScheduleDaySidebar/ScheduleDaySidebar';
import {ROOM_LIST_TITLE} from '../../../constants/translationLabels/common';

const BusyRoomsTable = (props) => {
    const { busyRooms, days, classes, columnsSize } = props;
    const { t } = useTranslation('common');
    return (
        <section className="busy-rooms-table-container">
            <ScheduleDaySidebar title={t(ROOM_LIST_TITLE)} days={days} classes={classes} />
            <section className="view-rooms">
                {busyRooms.map((busyRoom) => (
                    <div className="busy-room-section" key={busyRoom.room_id}>
                        <span
                            title={busyRoom.room_type}
                            className={`busy-room-title responsive-table-column-${columnsSize} schedule-card sticky-container`}
                        >
                            {busyRoom.room_name}
                        </span>
                        {busyRoom.schedules.map((schedule, index) => {
                            return days.includes(schedule.day) ? (
                                <TableItem
                                    key={index.toString() + busyRoom.room_id}
                                    index={index.toString() + busyRoom.room_id}
                                    classes={classes}
                                    schedule={schedule}
                                    columnsSize={columnsSize}
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
