import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

import { FaUserPlus } from 'react-icons/fa';
import Card from '../../share/Card/Card';
import {
    FORM_GROUPED_LABEL,
    FORM_HOURS_LABEL,
} from '../../constants/translationLabels/formElements';
import {
    COMMON_DELETE_SCHEDULE_ITEM,
    COMMON_EDIT_SCHEDULE_ITEM,
} from '../../constants/translationLabels/common';
import { getTeacherName } from '../../helper/renderTeacher';

const ScheduleItem = (props) => {
    const {
        translation: t,
        item: propItem,
        inBoard,
        deleteItem,
        editItem,
        fStrLetterCapital,
        addition,
        className,
    } = props;
    let { lesson } = props;
    let itemId;

    const item = propItem || null;

    if (item) {
        const { lesson: propsItemLesson, id: propsItemId } = item;
        lesson = propsItemLesson;
        itemId = propsItemId;
    }

    const itemNodeId = `card-${lesson.id}-group-${lesson.group.id}-${addition}`;
    const deleteNodeId = `delete-${lesson.id}-${lesson.group.id}-${addition}`;

    const isGroupped = (grouped) =>
        grouped ? (
            <FaUserPlus
                title={t(FORM_GROUPED_LABEL)}
                className="svg-btn copy-btn align-left info-btn"
            />
        ) : (
            ''
        );

    return (
        <Card id={itemNodeId} class={className} draggable>
            <input
                type="hidden"
                value={JSON.stringify({
                    lesson,
                    id: itemId,
                })}
            />
            {inBoard ? (
                <>
                    <div className="cards-btns delete-item" id={deleteNodeId}>
                        <MdDelete
                            title={t(COMMON_DELETE_SCHEDULE_ITEM)}
                            className="svg-btn delete-btn"
                            onClick={() => deleteItem(itemId, item.lesson.group.id)}
                        />
                        <MdEdit
                            title={t(COMMON_EDIT_SCHEDULE_ITEM)}
                            className="svg-btn edit-btn"
                            onClick={() => editItem(item)}
                        />
                    </div>
                </>
            ) : (
                ''
            )}

            <p>
                {fStrLetterCapital(lesson.subjectForSite)} (
                {t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`)})
            </p>
            <p>{getTeacherName(lesson.teacher)}</p>
            {inBoard ? (
                <p>
                    {isGroupped(lesson.grouped)}
                    <b>{item.room.name}</b>
                </p>
            ) : (
                <p>
                    {isGroupped(lesson.grouped)}
                    <b>1</b> {t(FORM_HOURS_LABEL)}
                </p>
            )}
        </Card>
    );
};

export default ScheduleItem;
