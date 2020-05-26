import React from 'react';
import { MdDelete } from 'react-icons/md';

import Card from '../../share/Card/Card';

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
                    {t('common:room_card_title')} <b>{item.room.name}</b>
                </p>
            ) : (
                <p>
                    <b>1</b> {t('formElements:hours_label')}
                </p>
            )}
        </Card>
    );
};

export default ScheduleItem;
