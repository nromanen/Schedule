import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import Card from '../../share/Card/Card';
import './BusyRooms.scss';
import { useTranslation } from 'react-i18next';
import { getScheduleItemsService } from '../../services/scheduleService';
import { getClassScheduleListService } from '../../services/classService';
import { CircularProgress } from '@material-ui/core';
import { setLoadingService } from '../../services/loadingService';
import AdminPage from '../AdminPage/AdminPage';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import {
    WEEK_ODD_TITLE,
    WEEK_EVEN_TITLE,
    BUSY_ROOMS_HEADING,
} from '../../constants/translationLabels/common';

const BusyRooms = (props) => {
    const { t } = useTranslation('common');

    useEffect(() => getScheduleItemsService(), []);
    useEffect(() => {
        getClassScheduleListService();
        setLoadingService(true);
    }, []);

    const busyRooms = props.busyRooms[0];

    const isLoading = props.loading;

    const conflictLesson = 'more-then-one-conflict';
    const grouppedLesson = 'more-then-one';

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

    const renderWeekRoomInfo = (schedule, index, type = 'odd') => {
        return props.currentSemester.semester_classes.map((scheduleClass) => {
            let in_arrayIndex = -1;
            in_arrayIndex =
                type === 'odd'
                    ? schedule.classes[0].odd.findIndex(
                          (classItem) => classItem.class_id === scheduleClass.id,
                      )
                    : schedule.classes[0].even.findIndex(
                          (classItem) => classItem.class_id === scheduleClass.id,
                      );
            const classOne =
                type === 'odd'
                    ? schedule.classes[0].odd.find(
                          (classItem) => classItem.class_id === scheduleClass.id,
                      )
                    : schedule.classes[0].even.find(
                          (classItem) => classItem.class_id === scheduleClass.id,
                      );
            if (in_arrayIndex < 0 || !classOne || classOne.lessons.length <= 0) {
                return (
                    <div className="class-info" key={index + scheduleClass.class_name}>
                        <div className="class-info-data class-number">
                            {scheduleClass.class_name}
                        </div>
                        <div className="class-info-data">
                            <div className="green-free"></div>
                        </div>
                    </div>
                );
            }
            let intersectClass = '';
            if (classOne && classOne.lessons && classOne.lessons.length > 1) {
                intersectClass = conflictLesson;
            }
            let grouppedLessonClass = '';
            classOne.lessons.map((lessonOne) => {
                grouppedLessonClass = lessonOne.groups.length > 1 ? grouppedLesson : '';
            });
            return (
                <div className="class-info" key={index + classOne.class_name + classOne.group_name}>
                    <div className="class-info-data class-number">{classOne.class_name}</div>
                    <div
                        className={`class-info-data group-height ${grouppedLessonClass}${intersectClass}`}
                    >
                        {classOne.lessons.map((lessonOne) => {
                            return lessonOne.groups.map((groupItem) => {
                                const hoverInfo =
                                    lessonOne.teacher_for_site + lessonOne.subject_for_site;
                                return (
                                    <p title={hoverInfo} key={hoverInfo + lessonOne.name}>
                                        {groupItem.group_name}
                                    </p>
                                );
                            });
                        })}
                    </div>
                </div>
            );
        });
    };

    const renderRoomDay = (schedule, index) => (
        <section className="room-day" key={index + schedule.day}>
            <h3 className="room-heading">{t(`day_of_week_${schedule.day}`)}</h3>
            <section>
                <Fragment key={index}>
                    <div className="even-odd-week">
                        <span className="even-odd-heading">{t(WEEK_ODD_TITLE)}</span>
                        {renderWeekRoomInfo(schedule, index, 'odd')}
                    </div>
                    <div className="even-odd-week">
                        <span className="even-odd-heading">{t(WEEK_EVEN_TITLE)}</span>
                        {renderWeekRoomInfo(schedule, index, 'even')}
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
                            <h2 className="busy-heading">{t(BUSY_ROOMS_HEADING)}</h2>
                            <section className="view-rooms">
                                {busyRooms.map((busyRoom) => (
                                    <Card class="busy-room" key={busyRoom.room_id}>
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
