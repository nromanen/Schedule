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
    let { lesson } = props;
    let itemId;

    const item = props.item || null;
    const t = props.translation;
    const { fStrLetterCapital, addition } = props;

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
        <Card id={itemNodeId} class={props.class} draggable>
            <input
                type="hidden"
                value={JSON.stringify({
                    lesson,
                    id: itemId,
                })}
            />
            {props.inBoard ? (
                <>
                    <div className="cards-btns delete-item" id={deleteNodeId}>
                        <MdDelete
                            title={t(COMMON_DELETE_SCHEDULE_ITEM)}
                            className="svg-btn delete-btn"
                            onClick={() => props.deleteItem(itemId, item.lesson.group.id)}
                        />
                        <MdEdit
                            title={t(COMMON_EDIT_SCHEDULE_ITEM)}
                            className="svg-btn edit-btn"
                            onClick={() => props.editItem(item)}
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
            {props.inBoard ? (
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
