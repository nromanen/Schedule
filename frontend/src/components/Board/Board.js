import React from 'react';

import { colors } from '../../constants/schedule/colors';
import { cssClasses } from '../../constants/schedule/cssClasses';
import { checkAvailabilityScheduleService } from '../../services/scheduleService';
import { setLoadingService } from '../../services/loadingService';

const Board = props => {
    const itemGroupId = props.itemGroupId;

    const drop = e => {
        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');

        const card = document.getElementById(card_id);
        if (card) card.style.display = 'block';

        const arr = e.target.id.split('-');
        const day = arr[3];
        const classId = arr[5];
        const week = arr[7];

        const item = JSON.parse(card.childNodes[0].value);
        let itemId = item.id;

        let obj = {
            lessonId: item.lesson.id,
            dayOfWeek: day.toUpperCase(),
            periodId: +classId,
            evenOdd: week.toUpperCase(),
            semesterId: props.currentSemester.id
        };
        checkAvailabilityScheduleService(obj);
        setLoadingService(true);
        if (itemId) obj = { ...obj, id: itemId };

        props.setModalData({ item: obj, groupId: item.lesson.group.id });
        props.openDialog();
    };

    const dragOver = e => {
        const target = e.target;
        const children = target.childNodes;
        const arr = target.id.split('-');
        const borderGroupId = +arr[1];

        if (
            borderGroupId !== itemGroupId &&
            target.classList.contains(cssClasses.SCHEDULE_BOARD)
        ) {
            target.style.backgroundColor = colors.DANGER;
        } else if (
            target.classList.contains(cssClasses.SCHEDULE_BOARD) &&
            children[1]
        ) {
            children[1].style.backgroundColor = colors.DANGER;
            target.style.backgroundColor = colors.DANGER;
        } else if (
            !children[1] &&
            target.classList.contains(cssClasses.SCHEDULE_BOARD)
        ) {
            target.style.backgroundColor = colors.ALLOW;
            e.preventDefault();
        }
    };

    const dragLeave = e => {
        const target = e.target;
        const children = target.childNodes;
        const parent = target.parentNode;

        const arr = target.id.split('-');
        const borderGroupId = +arr[1];

        if (borderGroupId === itemGroupId && !target.childNodes[1]) {
            target.style.backgroundColor = colors.POSSIBILITY;
        } else if (
            target.classList.contains(cssClasses.SCHEDULE_BOARD) &&
            children[1]
        ) {
            target.style.backgroundColor = colors.NOTHING;
            children[1].style.backgroundColor = colors.NOTHING;
        } else if (
            parent &&
            parent.classList.contains(cssClasses.SCHEDULE_BOARD)
        ) {
            parent.style.backgroundColor = colors.NOTHING;
            parent.parentNode.style.backgroundColor = colors.NOTHING;
        } else {
            target.style.backgroundColor = colors.NOTHING;
        }
    };

    return (
        <div
            id={props.id}
            onDrop={drop}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            className={props.className}
        >
            {props.children}
        </div>
    );
};

export default Board;
