import './BusyRooms.scss';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, Fragment } from 'react';
import { CircularProgress } from '@material-ui/core';
import Card from '../../share/Card/Card';
import { navigation } from '../../constants/navigation';
import { setLoadingService } from '../../services/loadingService';
import { getScheduleItemsService } from '../../services/scheduleService';
import { getClassScheduleListService } from '../../services/classService';
import NavigationPage from '../../components/Navigation/NavigationPage';
import WeekRoomInfo from '../../components/WeekRoomInfo/WeekRoomInfo';

const BusyRooms = (props) => {
    const { t } = useTranslation('common');
    const busyRooms = props.busyRooms[0];
    const { currentSemester, isLoading } = props;

    useEffect(() => {
        getScheduleItemsService();
        getClassScheduleListService();
        setLoadingService(true);
    }, []);
    let busyRoomsLength;

    if (busyRooms !== undefined) {
        busyRoomsLength = busyRooms.length;
    }

    const renderRoomTitle = (name, type) => (
        <h3 className="room-heading">
            <span className="room-name">{name}</span>
            <span className="room-type">{type}</span>
        </h3>
    );

    const renderRoomDay = (schedule, index) => (
        <section className="room-day" key={index + schedule.day}>
            <h3 className="room-heading">{t(`day_of_week_${schedule.day}`)}</h3>
            <section>
                <Fragment key={index}>
                    <div className="even-odd-week">
                        <span className="even-odd-heading">{t('week_odd_title')}</span>
                        <WeekRoomInfo
                            currentSemester={currentSemester}
                            schedule={schedule}
                            type="odd"
                        />
                    </div>
                    <div className="even-odd-week">
                        <span className="even-odd-heading">{t('week_even_title')}</span>
                        <WeekRoomInfo
                            currentSemester={currentSemester}
                            schedule={schedule}
                            type="even"
                        />
                    </div>
                </Fragment>
            </section>
        </section>
    );
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
                            <NavigationPage val={navigation.BUSY_ROOMS} />
                            <h2 className="busy-heading">{t('busy_rooms_heading')}</h2>
                            <section className="view-rooms">
                                {busyRooms.map((busyRoom) => (
                                    <Card additionClassName="busy-room" key={busyRoom.room_id}>
                                        {renderRoomTitle(busyRoom.room_name, busyRoom.room_type)}

                                        {busyRoom.schedules.map((schedule, index) => {
                                            return props.currentSemester.semester_days.includes(
                                                schedule.day,
                                            )
                                                ? renderRoomDay(schedule, index)
                                                : '';
                                        })}
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

const mapStateToProps = (state) => ({
    busyRooms: state.busyRooms.busyRooms,
    loading: state.loadingIndicator.loading,
    currentSemester: state.schedule.currentSemester,
});

export default connect(mapStateToProps, {})(BusyRooms);
