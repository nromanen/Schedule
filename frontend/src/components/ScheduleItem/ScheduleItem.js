import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

import { FaUserPlus } from 'react-icons/fa';
import Card from '../../share/Card/Card';
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
                title={t('formElements:grouped_label')}
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
                            title={t('common:delete_schedule_item')}
                            className="svg-btn delete-btn"
                            onClick={() => deleteItem(itemId, item.lesson.group.id)}
                        />
                        <MdEdit
                            title={t('common:edit_schedule_item')}
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
                    <b>1</b> {t('formElements:hours_label')}
                </p>
            )}
        </Card>
    );
};

export default ScheduleItem;
