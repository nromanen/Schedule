import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import Card from '../../share/Card/Card';
import './BusyRooms.scss';
import { useTranslation } from 'react-i18next';
import { getScheduleItemsService } from '../../services/scheduleService';
import { getClassScheduleListService } from '../../services/classService';
import { CircularProgress } from '@material-ui/core';
import { setLoadingService } from '../../services/loadingService';

const BusyRooms = props => {
    const { t } = useTranslation('common');

    useEffect(() => getScheduleItemsService(), []);
    useEffect(() => {
        getClassScheduleListService();
        setLoadingService(true);
    }, []);

    const busyRooms = props.busyRooms[0];

    const isLoading = props.loading;

    let moreThen = 'more-then-one';

    let busyRoomsLength;

    if (busyRooms !== undefined) {
        busyRoomsLength = busyRooms.length;
    }

    return (
        <div className="busy-rooms-container">
            {isLoading ? (
                <h2 className="busy-heading">
                    <CircularProgress />
                </h2>
            ) : (
                <>
                    {busyRoomsLength > 0 ? (
                        <>
                            <h2 className="busy-heading">
                                {t('busy_rooms_heading')}
                            </h2>
                            <section className="view-rooms">
                                {busyRooms.map(busyRoom => (
                                    <Card
                                        class="busy-room"
                                        key={busyRoom.room_id}
                                    >
                                        <h3 className="room-heading">
                                            <span className="room-name">
                                                {busyRoom.room_name}
                                            </span>
                                            <span className="room-type">
                                                {busyRoom.room_type}
                                            </span>
                                        </h3>

                                        {busyRoom.schedules.map(
                                            (schedule, index) => {
                                                if (
                                                    props.currentSemester.semester_days.includes(
                                                        schedule.day
                                                    )
                                                )
                                                    return (
                                                        <section
                                                            className="room-day"
                                                            key={
                                                                index +
                                                                schedule.day
                                                            }
                                                        >
                                                            <h3 className="room-heading">
                                                                {t(
                                                                    `day_of_week_${schedule.day}`
                                                                )}
                                                            </h3>

                                                            <section>
                                                                <Fragment
                                                                    key={index}
                                                                >
                                                                    <div className="even-odd-week">
                                                                        <span className="even-odd-heading">
                                                                            {t(
                                                                                'week_even_title'
                                                                            )}
                                                                        </span>
                                                                        {props.currentSemester.semester_classes.map(
                                                                            scheduleClass => {
                                                                                const in_arrayIndex = schedule.classes[0].even.findIndex(
                                                                                    evenItem =>
                                                                                        evenItem.class_id ===
                                                                                        scheduleClass.id
                                                                                );
                                                                                let evenOne = schedule.classes[0].even.find(
                                                                                    evenItem =>
                                                                                        evenItem.class_id ===
                                                                                        scheduleClass.id
                                                                                );

                                                                                if (
                                                                                    in_arrayIndex <
                                                                                    0
                                                                                ) {
                                                                                    return (
                                                                                        <div
                                                                                            className="class-info"
                                                                                            key={
                                                                                                index +
                                                                                                scheduleClass.class_name
                                                                                            }
                                                                                        >
                                                                                            <div className="class-info-data">
                                                                                                {' '}
                                                                                                {
                                                                                                    scheduleClass.class_name
                                                                                                }
                                                                                            </div>

                                                                                            <div className="class-info-data">
                                                                                                <div className="green-free"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                } else {
                                                                                    evenOne.groups = [];
                                                                                    schedule.classes[0].even.map(
                                                                                        evenItemMap => {
                                                                                            if (
                                                                                                evenOne.class_id ===
                                                                                                evenItemMap.class_id
                                                                                            ) {
                                                                                                evenOne.groups.push(
                                                                                                    evenItemMap.group_name
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );

                                                                                    return (
                                                                                        <div
                                                                                            className="class-info"
                                                                                            key={
                                                                                                index +
                                                                                                evenOne.class_name +
                                                                                                evenOne.group_name
                                                                                            }
                                                                                        >
                                                                                            <div className="class-info-data">
                                                                                                {
                                                                                                    evenOne.class_name
                                                                                                }
                                                                                            </div>
                                                                                            {evenOne
                                                                                                .groups
                                                                                                .length >
                                                                                            1 ? (
                                                                                                <div
                                                                                                    className={`class-info-data group-height ${moreThen}`}
                                                                                                >
                                                                                                    {evenOne.groups.join(
                                                                                                        ', '
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="class-info-data group-height">
                                                                                                    {evenOne.groups.join(
                                                                                                        ', '
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            }
                                                                        )}
                                                                    </div>

                                                                    <div className="even-odd-week">
                                                                        <span className="even-odd-heading">
                                                                            {t(
                                                                                'week_odd_title'
                                                                            )}
                                                                        </span>
                                                                        {props.currentSemester.semester_classes.map(
                                                                            scheduleClass => {
                                                                                const in_arrayIndex = schedule.classes[0].odd.findIndex(
                                                                                    oddItem =>
                                                                                        oddItem.class_id ===
                                                                                        scheduleClass.id
                                                                                );
                                                                                let oddOne = schedule.classes[0].odd.find(
                                                                                    oddItem =>
                                                                                        oddItem.class_id ===
                                                                                        scheduleClass.id
                                                                                );

                                                                                if (
                                                                                    in_arrayIndex <
                                                                                    0
                                                                                ) {
                                                                                    return (
                                                                                        <div
                                                                                            className="class-info"
                                                                                            key={
                                                                                                index +
                                                                                                scheduleClass.class_name
                                                                                            }
                                                                                        >
                                                                                            <div className="class-info-data">
                                                                                                {' '}
                                                                                                {
                                                                                                    scheduleClass.class_name
                                                                                                }
                                                                                            </div>

                                                                                            <div className="class-info-data">
                                                                                                <div className="green-free"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                } else {
                                                                                    oddOne.groups = [];
                                                                                    schedule.classes[0].odd.map(
                                                                                        oddItemMap => {
                                                                                            if (
                                                                                                oddOne.class_id ===
                                                                                                oddItemMap.class_id
                                                                                            ) {
                                                                                                oddOne.groups.push(
                                                                                                    oddItemMap.group_name
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );

                                                                                    return (
                                                                                        <div
                                                                                            className="class-info"
                                                                                            key={
                                                                                                index +
                                                                                                oddOne.class_name +
                                                                                                oddOne.group_name
                                                                                            }
                                                                                        >
                                                                                            <div className="class-info-data">
                                                                                                {
                                                                                                    oddOne.class_name
                                                                                                }
                                                                                            </div>
                                                                                            {oddOne
                                                                                                .groups
                                                                                                .length >
                                                                                            1 ? (
                                                                                                <div
                                                                                                    className={`class-info-data group-height ${moreThen}`}
                                                                                                >
                                                                                                    {oddOne.groups.join(
                                                                                                        ', '
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="class-info-data group-height">
                                                                                                    {oddOne.groups.join(
                                                                                                        ', '
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </Fragment>
                                                            </section>
                                                        </section>
                                                    );
                                            }
                                        )}
                                    </Card>
                                ))}
                            </section>
                        </>
                    ) : (
                        <>
                            <h2 className="busy-heading">
                                <CircularProgress />
                            </h2>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    busyRooms: state.busyRooms.busyRooms,
    loading: state.loadingIndicator.loading,
    currentSemester: state.schedule.currentSemester
});

export default connect(mapStateToProps, {})(BusyRooms);
