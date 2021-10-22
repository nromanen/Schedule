import React, { Fragment, useEffect, useRef, useState } from 'react';
import { IoMdMore } from 'react-icons/all';

import { makeStyles } from '@material-ui/core/styles';
import Board from '../Board/Board';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import ScheduleDialog from '../ScheduleDialog/ScheduleDialog';

import { firstStringLetterCapital } from '../../helper/strings';

import {
    addItemToScheduleService,
    deleteItemFromScheduleService,
    checkAvailabilityChangeRoomScheduleService,
    editRoomItemToScheduleService,
} from '../../services/scheduleService';

import { getLessonsByGroupService, selectGroupIdService } from '../../services/lessonService';
import { setLoadingService } from '../../services/loadingService';

import { cssClasses } from '../../constants/schedule/cssClasses';
import { colors } from '../../constants/schedule/colors';
import { FORM_DAY_LABEL } from '../../constants/translationLabels/formElements';
import { CLASS_SCHEDULE, WEEK_LABEL } from '../../constants/translationLabels/common';
import './Schedule.scss';

const Schedule = (props) => {
    const {
        groups,
        itemGroupId,
        groupId,
        items,
        currentSemester,
        translation: t,
        rooms,
        availability,
        isLoading,
    } = props;
    const [open, setOpen] = useState(false);
    const [itemData, setItemData] = useState(null);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevGroupId = usePrevious(groupId);

    useEffect(() => {
        if (groupId !== null) {
            const el = document.getElementById(`group-${groupId}`);
            el.scrollIntoView({ block: 'center', inline: 'center' });
            const parent = el.parentNode;
            parent.classList.add('selected-group');
        }
        if (prevGroupId) {
            const prevEl = document.getElementById(`group-${prevGroupId}`);
            const parent = prevEl.parentNode;
            parent.classList.remove('selected-group');
        }
    }, [groupId]);

    const setNewItemHandle = (item, room, group) => {
        getLessonsByGroupService(group);
        selectGroupIdService(group);
        if (item.id) deleteItemFromScheduleService(item.id);

        addItemToScheduleService({ ...item, roomId: room.id });
    };

    const setEditItemHandle = (itemId, roomId, group) => {
        getLessonsByGroupService(group);
        selectGroupIdService(group);
        editRoomItemToScheduleService({ itemId, roomId });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value) {
            setLoadingService(true);
            let el = '';
            if (value.itemData.item.id) {
                setEditItemHandle(value.itemData.item.id, value.room.id, value.itemData.groupId);

                el = document.getElementById(
                    `card-${value.itemData.item.lesson.id}-group-${
                        value.itemData.groupId
                    }-in-day-${value.itemData.item.dayOfWeek.toLowerCase()}-class-${
                        value.itemData.item.period.id
                    }-week-${value.itemData.item.evenOdd.toLowerCase()}`,
                );
            } else {
                setNewItemHandle(value.itemData.item, value.room, value.itemData.groupId);
                el = document.getElementById(
                    `group-${
                        value.itemData.groupId
                    }-day-${value.itemData.item.dayOfWeek.toLowerCase()}-class-${
                        value.itemData.item.periodId
                    }-week-${value.itemData.item.evenOdd.toLowerCase()}`,
                );
            }
            el.scrollIntoView();
            setTimeout(() => {
                el.style.backgroundColor = colors.ALLOW;
            }, 1000);

            setTimeout(() => {
                el.style.backgroundColor = colors.NOTHING;
            }, 3000);
        }
    };

    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    const dayContainerHeight = classes.length * 150;

    const useStyles = makeStyles({
        day: {
            height: dayContainerHeight,
            maxHeight: dayContainerHeight,
        },
    });
    const elClasses = useStyles();
    // TODO delete this and replace with unified capitalize
    const firstStringLetterCapitalHandle = (str) => {
        return firstStringLetterCapital(str);
    };

    const deleteItemFromScheduleHandler = (itemId, group) => {
        deleteItemFromScheduleService(itemId);
        getLessonsByGroupService(group);
        selectGroupIdService(group);
    };
    const editItemOnScheduleHandler = (item) => {
        setItemData({ item, groupId: item.lesson.group.id });
        getLessonsByGroupService(item.lesson.group.id);
        selectGroupIdService(item.lesson.group.id);

        const itemId = item.id;

        let obj = {
            dayOfWeek: item.dayOfWeek,
            periodId: +item.period.id,
            evenOdd: item.evenOdd,
            semesterId: item.lesson.semester.id,
        };
        checkAvailabilityChangeRoomScheduleService(obj);
        setLoadingService(true);
        if (itemId) obj = { ...obj, id: itemId };
        setOpen(true);
    };

    const conditionFunc = (item, lesson, group) => {
        return (
            `group-${item.lesson.group.id}-day-${item.dayOfWeek.toLowerCase()}-class-${
                item.period.id
            }-week-${item.evenOdd.toLowerCase()}` ===
            `group-${group.id}-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`
        );
    };

    const addDeleteBtnToItem = (item, group, lesson) => {
        const addition = `in-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`;
        const itemNodeId = `card-${item.lesson.id}-group-${group.id}-${addition}`;
        const deleteNodeId = `delete-${item.lesson.id}-${group.id}-${addition}`;
        setTimeout(() => {
            const itemNode = document.getElementById(itemNodeId);
            const deleteNode = document.getElementById(deleteNodeId);
            if (deleteNode && itemNode) {
                itemNode.addEventListener('mouseenter', () => {
                    deleteNode.style.display = 'block';
                });
                itemNode.addEventListener('mouseleave', () => {
                    deleteNode.style.display = 'none';
                });
            }
        }, 1000);
    };

    const itemInBoard = (group, lesson, index) => {
        return items.map((item) => {
            if (conditionFunc(item, lesson, group)) {
                const addition = `in-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`;
                addDeleteBtnToItem(item, group, lesson);
                return (
                    <section
                        key={group.id + index + item.id}
                        className={cssClasses.IN_BOARD_SECTION}
                    >
                        <ScheduleItem
                            inBoard
                            addition={addition}
                            class={cssClasses.IN_BOARD_CARD}
                            item={item}
                            deleteItem={deleteItemFromScheduleHandler}
                            editItem={editItemOnScheduleHandler}
                            fStrLetterCapital={firstStringLetterCapitalHandle}
                            translation={t}
                        />
                    </section>
                );
            }
            return null;
        });
    };

    const allLessons = [];
    days.forEach((day, outerIndex) => {
        classes.forEach((classNumber, index) => {
            allLessons.push(
                {
                    day: { name: day.toLowerCase() },
                    classNumber,
                    week: 'odd',
                    id: `${index}-${outerIndex}`,
                },
                {
                    day: { name: day.toLowerCase() },
                    classNumber,
                    week: 'even',
                    id: `${index}-${outerIndex}`,
                },
            );
        });
    });
    const getDayColour = (index) => {
        return index % 2 ? 'violet-day' : 'blue-day';
    };

    return (
        <section className="cards-container schedule">
            <ScheduleDialog
                translation={t}
                itemData={itemData}
                rooms={rooms}
                availability={availability}
                open={open}
                isLoading={isLoading}
                onClose={handleClose}
            />
            <aside className="day-classes-aside">
                <section className="card empty-card">Група</section>
                {days.map((day, index) => (
                    <section className="cards-container day-container" key={day}>
                        <section
                            id={day}
                            className={`${elClasses.day} ${getDayColour(index)} schedule-day card`}
                        >
                            {t(`day_of_week_${day}`)}
                        </section>
                        <section className="class-section">
                            {classes.map((classScheduler) => (
                                <Fragment key={classScheduler.id}>
                                    <p
                                        className={`day-class-week-general ${day}-${classScheduler.id}`}
                                    ></p>
                                    <section
                                        id={`${classScheduler.id}-${day}`}
                                        className="card schedule-class"
                                        key={classScheduler.id}
                                    >
                                        {classScheduler.class_name}
                                    </section>
                                    <p
                                        className={`day-class-week-general ${day}-${classScheduler.id}`}
                                    ></p>
                                </Fragment>
                            ))}
                        </section>
                    </section>
                ))}
            </aside>

            <section className="groups-section ">
                {groups.map((group) => (
                    <section key={`group-${group.id}`} className="group-section" id={`${group.id}`}>
                        <div className="group-title card" id={`group-${group.id}`}>
                            {group.title}
                        </div>
                        {allLessons.map((lesson, index) => (
                            <div
                                key={`${group.id}-${lesson.id}-${lesson.week}`}
                                className="board-div"
                            >
                                <Board
                                    group={group.id}
                                    day={lesson.day.name}
                                    classes={`${
                                        lesson.classNumber.id
                                    }-${lesson.day.name.toUpperCase()}`}
                                    classDay={`${lesson.day.name.toUpperCase()}-${
                                        lesson.classNumber.id
                                    }`}
                                    currentSemester={currentSemester}
                                    setModalData={setItemData}
                                    openDialog={handleClickOpen}
                                    itemGroupId={itemGroupId}
                                    id={`group-${group.id}-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`}
                                    className={`board card ${cssClasses.SCHEDULE_BOARD} group-${group.id} schedule-board `}
                                >
                                    <IoMdMore
                                        className="more-icon"
                                        title={`${t(FORM_DAY_LABEL)}: ${t(
                                            `day_of_week_${lesson.day.name.toUpperCase()}`,
                                        ).toLowerCase()}\n${t(WEEK_LABEL)}: ${t(
                                            `week_${lesson.week}_title`,
                                        )}\n${t(CLASS_SCHEDULE)}: ${lesson.classNumber.class_name}`}
                                    />
                                    {itemInBoard(group, lesson, index)}
                                </Board>
                            </div>
                        ))}
                        <div className="group-title card" id={`group-${group.id}`}>
                            {group.title}
                        </div>
                    </section>
                ))}
            </section>
        </section>
    );
};

export default Schedule;
