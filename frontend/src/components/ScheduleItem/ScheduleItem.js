import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';

import { FaUserPlus } from 'react-icons/fa';
import Card from '../../share/Card/Card';
import { getTeacherFullName, getTeacherName } from '../../helper/renderTeacher';
import groups from '../../redux/reducers/groups';
import { FORM_GROUPED_LABEL, FORM_HOURS_LABEL } from '../../constants/translationLabels';
import {
    COMMON_DELETE_SCHEDULE_ITEM,
    COMMON_EDIT_SCHEDULE_ITEM,
} from '../../constants/translationLabels/common';


const ScheduleItem = (props) => {
    let { lesson } = props;
    let itemId;

    const item = props.item || null;
    const t = props.translation;
    const { fStrLetterCapital } = props;

    if (item) {
        lesson = item.lesson;
        itemId = item.id;
    }

    const { addition } = props;

    const itemNodeId = `card-${lesson.id}-group-${lesson.group.id}-${addition}`;
    const deleteNodeId = `delete-${lesson.id}-${lesson.group.id}-${addition}`;

    const getTitleLesson = () => {
        if (lesson.grouped) {
            console.log(lesson);
            // const groupsFilter = props.lessons.filter(les => les.grouped===true&&les.subjectForSite === lesson.subjectForSite);
            // const groups = groupsFilter.map(item => item.subjectForSite === lesson.subjectForSite &&
            //     item.lessonType === lesson.lessonType &&
            //     lesson.teacher.id === item.teacher.id);
            // console.log(groups)
        }
        return null;
    };

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
            {getTitleLesson()}
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
