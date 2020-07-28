import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

import Card from '../../share/Card/Card';
import { FaUserPlus } from 'react-icons/fa';

const ScheduleItem = props => {
    let lesson = props.lesson;
    let itemId;

    const item = props.item || null;
    const t = props.translation;
    const { fStrLetterCapital } = props;

    if (item) {
        lesson = item.lesson;
        itemId = item.id;
    }

    const addition = props.addition;

    const itemNodeId = `card-${lesson.id}-group-${lesson.group.id}-${addition}`;
    const deleteNodeId = `delete-${lesson.id}-${lesson.group.id}-${addition}`;

    const isGroupped = grouped =>
        grouped ? (
            <FaUserPlus
                title={t('formElements:grouped_label')}
                className="svg-btn copy-btn align-left info-btn"
            />
        ) : (
            ''
        );

    return (
        <Card id={itemNodeId} class={props.class} draggable={true}>
            <input
                type="hidden"
                value={JSON.stringify({
                    lesson: lesson,
                    id: itemId
                })}
            />
            {props.inBoard ? (
                <>
                    <div className="cards-btns delete-item" id={deleteNodeId}>
                        <MdDelete
                            title={t('common:delete_schedule_item')}
                            className="svg-btn delete-btn"
                            onClick={() =>
                                props.deleteItem(itemId, item.lesson.group.id)
                            }
                        />
                        <MdEdit
                            title={t('common:edit_schedule_item')}
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
                {t(
                    `formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`
                )}
                )
            </p>
            <p>{lesson.teacherForSite}</p>
            {props.inBoard ? (
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
