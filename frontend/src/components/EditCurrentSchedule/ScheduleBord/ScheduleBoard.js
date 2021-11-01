import React, { useState, useEffect } from 'react';
import i18n from 'i18next';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { setLoadingService } from '../../../services/loadingService';
import ScheduleItem from '../../ScheduleItem/ScheduleItem';
import './ScheduleBoard.scss';
import { checkAvailabilityScheduleStart } from '../../../actions/schedule';

const ScheduleBoard = (props) => {
    const {
        lesson,
        isSelectedGroup,
        dragItemData,
        additionClassName,
        currentSemester,
        groupId,
        scheduleItems,
        openDialogWithData,
        checkScheduleItemAvailability,
    } = props;
    const { classId, dayName, week } = lesson;
    const [className, setClassName] = useState('');
    const [boardFill, setBoardFill] = React.useState({});
    useEffect(() => {
        setBoardFill(
            scheduleItems.find(
                (item) =>
                    item.lesson.group.id === groupId &&
                    item.period.id === classId &&
                    item.dayOfWeek === dayName &&
                    item.evenOdd === week,
            ),
        );
    }, [scheduleItems]);

    const changeBoardStyle = (selectedClassName, notSelectedClassName, callBack = () => {}) => {
        if (!isSelectedGroup) {
            setClassName(notSelectedClassName);
        } else {
            setClassName(selectedClassName);
            callBack();
        }
    };

    useEffect(() => {
        changeBoardStyle('posable', '');
    }, [isSelectedGroup]);

    const drop = (e) => {
        if (!isSelectedGroup) {
            e.preventDefault();
            return;
        }
        const AddObj = {
            id: dragItemData.id,
            lessonId: dragItemData.id,
            dayOfWeek: dayName,
            periodId: +classId,
            evenOdd: week,
            semesterId: currentSemester.id,
        };
        checkScheduleItemAvailability(AddObj);
        setClassName('posable');
        setLoadingService(true);
        openDialogWithData({ type: 'add', item: AddObj, groupId });
    };

    const dragOver = (e) => {
        changeBoardStyle('allow', 'not-allow', () => e.preventDefault());
    };
    const dragLeave = (e) => {
        changeBoardStyle('posable', '', () => e.preventDefault());
    };

    return (
        <>
            {!isEmpty(boardFill) ? (
                <ScheduleItem itemData={boardFill} openDialogWithData={openDialogWithData} />
            ) : (
                <div
                    className={`board ${additionClassName} ${className}`}
                    onDrop={drop}
                    onDragOver={dragOver}
                    onDragLeave={dragLeave}
                >
                    <p>{i18n.t(`week_${week.toLowerCase()}_title`)}</p>
                </div>
            )}
        </>
    );
};
const mapStateToProps = (state) => ({
    scheduleItems: state.schedule.items,
});
const mapDispatchToProps = (dispatch) => ({
    checkScheduleItemAvailability: (item) => dispatch(checkAvailabilityScheduleStart(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBoard);
