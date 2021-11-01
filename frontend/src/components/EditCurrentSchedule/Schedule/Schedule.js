import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import i18n from 'i18next';
import ScheduleBoard from '../../../containers/EditCurrentSchedule/ScheduleBoard';
import ScheduleItem from '../../ScheduleItem/ScheduleItem';
import ScheduleDialog from '../../../containers/Dialogs/ScheduleDialog';

import { cssClasses } from '../../../constants/schedule/cssClasses';
import { colors } from '../../../constants/schedule/colors';
import { FORM_DAY_LABEL } from '../../../constants/translationLabels/formElements';
import {
    SCHEDULE_TITLE,
    NO_CURRENT_SEMESTER,
    CLEAR_SCHEDULE_LABEL,
    USE_PC,
} from '../../../constants/translationLabels/common';
import './Schedule.scss';
import { addItemsToScheduleStart, editRoomItemToScheduleStart } from '../../../actions/schedule';
import { getLessonsByGroup, selectGroupId } from '../../../actions';

const Schedule = (props) => {
    const {
        groups,
        dragItemData,
        groupId,
        currentSemester,
        allLessons,
        selectedGroupById,
        getLessonsByGroupId,
        addItemsToSchedule,
        editRoomItemToSchedule,
    } = props;
    const [isOpenScheduleDialog, setIsOpenScheduleDialog] = useState(false);
    const [dialogScheduleData, setDialogScheduleData] = useState(null);
    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    useEffect(() => {
        if (groupId !== null) {
            const el = document.getElementById(`group-${groupId}`);
            el.scrollIntoView({ block: 'center', inline: 'center' });
        }
    }, [groupId]);

    const openScheduleDialogWithData = (data) => {
        setDialogScheduleData(data);
        setIsOpenScheduleDialog(true);
    };

    const handleChangeSchedule = (roomId, actionData) => {
        const { item, type } = actionData;
        setIsOpenScheduleDialog(false);
        if (type === 'edit') {
            editRoomItemToSchedule({ itemId: item.id, roomId });
        } else {
            addItemsToSchedule({ ...item, roomId });
        }
        selectedGroupById(actionData.groupId);
        getLessonsByGroupId(actionData.groupId);
    };

    const handleClose = () => {
        setIsOpenScheduleDialog(false);
    };

    const getDayColour = (index) => {
        return index % 2 ? 'violet-day' : 'blue-day';
    };

    // console.log(allLessons);
    return (
        <div className="schedule">
            {isOpenScheduleDialog && (
                <ScheduleDialog
                    itemData={dialogScheduleData}
                    open={isOpenScheduleDialog}
                    handleChangeSchedule={handleChangeSchedule}
                    onClose={handleClose}
                />
            )}
            {currentSemester.id ? (
                <>
                    <aside className="day-classes-aside">
                        <div className="card group-title">Група</div>
                        {days.map((day, index) => (
                            <div className="cards-container day-container" key={day}>
                                <span className={`${getDayColour(index)} schedule-day card`}>
                                    {i18n.t(`day_of_week_${day}`)}
                                </span>
                                <div className="class-section">
                                    {classes.map((classScheduler) => (
                                        <Fragment key={classScheduler.id}>
                                            <div className="day-section">
                                                <span className="card schedule-class">
                                                    {classScheduler.class_name}
                                                </span>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>
                    <section className="groups-section ">
                        {groups.map((group) => {
                            const isSelectedGroup = group.id === groupId;
                            return (
                                <div
                                    key={`group-${group.id}`}
                                    className={`group-section ${
                                        isSelectedGroup ? 'selected-group' : ''
                                    }`}
                                >
                                    <span className="group-title card">{group.title}</span>
                                    {allLessons.map((lesson) => (
                                        <div
                                            key={`${group.id}-${lesson.id}-${lesson.week}`}
                                            className="board-container"
                                        >
                                            <ScheduleBoard
                                                lesson={lesson}
                                                groupId={group.id}
                                                currentSemester={currentSemester}
                                                openDialogWithData={openScheduleDialogWithData}
                                                dragItemData={dragItemData}
                                                isSelectedGroup={isSelectedGroup}
                                                additionClassName="card schedule-board"
                                            />
                                        </div>
                                    ))}
                                    <span className="group-title card">{group.title}</span>
                                </div>
                            );
                        })}
                    </section>
                </>
            ) : (
                <h2 className="no-current-semester">{i18n.t(NO_CURRENT_SEMESTER)}</h2>
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    addItemsToSchedule: (item) => dispatch(addItemsToScheduleStart(item)),
    editRoomItemToSchedule: (item) => dispatch(editRoomItemToScheduleStart(item)),
    selectedGroupById: (id) => dispatch(selectGroupId(id)),
    getLessonsByGroupId: (id) => dispatch(getLessonsByGroup(id)),
});

export default connect(null, mapDispatchToProps)(Schedule);
