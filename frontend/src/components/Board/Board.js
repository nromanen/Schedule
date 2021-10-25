import React from 'react';
import { isNil } from 'lodash';
import { connect } from 'react-redux';
import { colors } from '../../constants/schedule/colors';
import { cssClasses } from '../../constants/schedule/cssClasses';
import { setLoadingService } from '../../services/loadingService';
import './Board.scss';
import { checkAvailabilityScheduleRequested } from '../../actions/schedule';

const Board = (props) => {
    const {
        day,
        classDay,
        classes,
        group,
        itemGroupId,
        children,
        id,
        className,
        currentSemester,
        setModalData,
        openDialog,
        checkScheduleItemAvailability,
    } = props;
    const dayClassWeekString = 'day-class-week';
    const drop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('card_id');

        const card = document.getElementById(cardId);
        if (card) card.style.display = 'block';

        const arr = e.target.id.split('-');
        const dayString = arr[3];
        const classId = arr[5];
        const week = arr[7];

        const item = JSON.parse(card.childNodes[0].value);
        const itemId = item.id;

        let obj = {
            lessonId: item.lesson.id,
            dayOfWeek: dayString.toUpperCase(),
            periodId: +classId,
            evenOdd: week.toUpperCase(),
            semesterId: currentSemester.id,
        };

        checkScheduleItemAvailability(obj);

        setLoadingService(true);
        if (itemId) obj = { ...obj, id: itemId };

        setModalData({ item: obj, groupId: item.lesson.group.id });
        openDialog();
    };

    const dragOver = (e) => {
        const { target } = e;
        const childrenNodes = target.childNodes;
        const arr = target.id.split('-');
        const borderGroupId = +arr[1];

        if (borderGroupId !== itemGroupId && target.classList.contains(cssClasses.SCHEDULE_BOARD)) {
            target.style.backgroundColor = colors.DANGER;
        } else if (target.classList.contains(cssClasses.SCHEDULE_BOARD) && childrenNodes[1]) {
            childrenNodes[1].style.backgroundColor = colors.DANGER;
            target.style.backgroundColor = colors.DANGER;
        } else if (!childrenNodes[1] && target.classList.contains(cssClasses.SCHEDULE_BOARD)) {
            target.style.backgroundColor = colors.ALLOW;
            e.preventDefault();
        }
    };

    const dragLeave = (e) => {
        const { target } = e;
        const childrenNodes = target.childNodes;
        const parent = target.parentNode;

        const arr = target.id.split('-');
        const borderGroupId = +arr[1];

        if (borderGroupId === itemGroupId && !target.childNodes[1]) {
            target.style.backgroundColor = colors.POSSIBILITY;
        } else if (target.classList.contains(cssClasses.SCHEDULE_BOARD) && childrenNodes[1]) {
            target.style.backgroundColor = colors.NOTHING;
            childrenNodes[1].style.backgroundColor = colors.NOTHING;
        } else if (parent && parent.classList.contains(cssClasses.SCHEDULE_BOARD)) {
            parent.style.backgroundColor = colors.NOTHING;
            parent.parentNode.style.backgroundColor = colors.NOTHING;
        } else {
            target.style.backgroundColor = colors.NOTHING;
        }
    };
    const addClassDayBoard = () => {
        if (!isNil(classDay)) {
            const dayClassWeek = document.getElementsByClassName(classDay);
            dayClassWeek[0].classList.add(dayClassWeekString);
            dayClassWeek[1].classList.add(dayClassWeekString);
        }
    };
    const addClass = () => {
        if (!isNil(classes)) {
            const classesTmp = document.getElementById(classes);
            classesTmp.classList.add('classes');
        }
    };
    const addDay = () => {
        if (!isNil(day)) {
            const tmp = document.getElementById(day.toUpperCase());
            tmp.classList.add('day');
        }
    };
    const addGroup = () => {
        if (!isNil(group)) {
            const tmp = document.getElementById(group);
            tmp.classList.add('group');
        }
    };
    const addEffect = () => {
        if (children[1]) {
            addClassDayBoard();
            addClass();
            addDay();
            addGroup();
        }
    };
    const removeClassDayBoard = () => {
        if (!isNil(classDay)) {
            const dayClassWeek = document.getElementsByClassName(classDay);
            dayClassWeek[0].classList.remove(dayClassWeekString);
            dayClassWeek[1].classList.remove(dayClassWeekString);
        }
    };
    const removeClass = () => {
        if (!isNil(classes)) {
            const classesTmp = document.getElementById(classes);
            classesTmp.classList.remove('classes');
        }
    };
    const removeDay = () => {
        if (!isNil(day)) {
            const tmp = document.getElementById(day.toUpperCase());
            tmp.classList.remove('day');
        }
    };
    const removeGroup = () => {
        if (!isNil(group)) {
            const tmp = document.getElementById(group);
            tmp.classList.remove('group');
        }
    };
    const removeEffect = () => {
        if (children[1]) {
            removeClassDayBoard();
            removeClass();
            removeDay();
            removeGroup();
        }
    };
    return (
        <div
            id={id}
            onDrop={drop}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            className={className}
            onMouseOver={addEffect}
            onMouseLeave={removeEffect}
            onFocus={addEffect}
        >
            {children}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    checkScheduleItemAvailability: (item) => dispatch(checkAvailabilityScheduleRequested(item)),
});

export default connect(null, mapDispatchToProps)(Board);
