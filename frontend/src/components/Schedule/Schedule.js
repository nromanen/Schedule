import React, { useState } from 'react';
import { IoMdMore } from 'react-icons/all';

import Board from '../Board/Board';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import ScheduleDialog from '../ScheduleDialog/ScheduleDialog';

import { firstStringLetterCapital } from '../../helper/strings';

import {
    addItemToScheduleService,
    deleteItemFromScheduleService
} from '../../services/scheduleService';
import {
    getLessonsByGroupService,
    selectGroupIdService
} from '../../services/lessonService';
import { setLoadingService } from '../../services/loadingService';

import { cssClasses } from '../../constants/schedule/cssClasses';
import { colors } from '../../constants/schedule/colors';

import { makeStyles } from '@material-ui/core/styles';

const Schedule = props => {
    const { groups, itemGroupId } = props;
    const [open, setOpen] = useState(false);
    const [itemData, setItemData] = useState(null);

    const setNewItemHandle = (item, room, groupId) => {
        getLessonsByGroupService(groupId);
        selectGroupIdService(groupId);
        if (item.id) deleteItemFromScheduleService(item.id);

        addItemToScheduleService({ ...item, roomId: room.id });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
        if (value) {
            setLoadingService(true);
            setNewItemHandle(
                value.itemData.item,
                value.room,
                value.itemData.groupId
            );
            const el = document.getElementById(
                'group-' +
                    value.itemData.groupId +
                    '-day-' +
                    value.itemData.item.dayOfWeek.toLowerCase() +
                    '-class-' +
                    value.itemData.item.periodId +
                    '-week-' +
                    value.itemData.item.evenOdd.toLowerCase()
            );
            el.scrollIntoView();
            setTimeout(() => {
                el.style.backgroundColor = colors.ALLOW;
            }, 1000);

            setTimeout(() => {
                el.style.backgroundColor = colors.NOTHING;
            }, 3000);
        }
    };

    const items = props.items;

    const currentSemester = props.currentSemester;
    const days = currentSemester.semester_days;
    const classes = currentSemester.semester_classes;

    const t = props.translation;

    const boardHeight = 70;

    const useStyles = makeStyles({
        day: {
            top: boardHeight * classes.length
        }
    });
    const elClasses = useStyles();

    const firstStringLetterCapitalHandle = str => {
        return firstStringLetterCapital(str);
    };

    const deleteItemFromScheduleHandler = (itemId, groupId) => {
        deleteItemFromScheduleService(itemId);
        getLessonsByGroupService(groupId);
        selectGroupIdService(groupId);
    };

    const conditionFunc = (item, lesson, group) => {
        return (
            `group-${
                item.lesson.group.id
            }-day-${item.dayOfWeek.toLowerCase()}-class-${
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
        for (let item of items) {
            if (conditionFunc(item, lesson, group)) {
                const addition = `in-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`;
                addDeleteBtnToItem(item, group, lesson);
                return (
                    <section
                        key={group.id + index + item.id}
                        className={cssClasses.IN_BOARD_SECTION}
                    >
                        <ScheduleItem
                            inBoard={true}
                            addition={addition}
                            class={cssClasses.IN_BOARD_CARD}
                            item={item}
                            deleteItem={deleteItemFromScheduleHandler}
                            fStrLetterCapital={firstStringLetterCapitalHandle}
                            translation={t}
                        />
                    </section>
                );
            }
        }
    };

    const allLessons = [];
    days.forEach(day => {
        classes.forEach(classNumber => {
            for (let i = 0; i < 2; i++) {
                if ((i + 1) % 2 === 0) {
                    allLessons.push({
                        day: { name: day.toLowerCase() },
                        classNumber,
                        week: 'even'
                    });
                } else {
                    allLessons.push({
                        day: { name: day.toLowerCase() },
                        classNumber,
                        week: 'odd'
                    });
                }
            }
        });
    });

    return (
        <section className="cards-container">
            <ScheduleDialog
                translation={t}
                itemData={itemData}
                rooms={props.rooms}
                availability={props.availability}
                open={open}
                isLoading={props.isLoading}
                onClose={handleClose}
            />
            <aside className="day-classes-aside">
                <section className="card empty-card">Група</section>
                {days.map(day => (
                    <section
                        className="cards-container before-border"
                        key={day}
                    >
                        <section
                            className={elClasses.day + ' card schedule-day'}
                        >
                            {t(`day_of_week_${day}`)}
                        </section>
                        <section className="class-section">
                            {classes.map(classScheduler => (
                                <section
                                    className="card schedule-class"
                                    key={classScheduler.id}
                                >
                                    {classScheduler.class_name}
                                </section>
                            ))}
                        </section>
                    </section>
                ))}
            </aside>
            {groups.map(group => (
                <section key={'group-' + group.id}>
                    <div className="group-title card" id={`group-${group.id}`}>
                        {group.title}
                    </div>
                    {allLessons.map((lesson, index) => (
                        <div key={group + '-' + index} className="board-div">
                            <Board
                                currentSemester={currentSemester}
                                setModalData={setItemData}
                                openDialog={handleClickOpen}
                                itemGroupId={itemGroupId}
                                id={`group-${group.id}-day-${lesson.day.name}-class-${lesson.classNumber.id}-week-${lesson.week}`}
                                className={`board card ${cssClasses.SCHEDULE_BOARD} group-${group.id} schedule-board`}
                            >
                                <IoMdMore
                                    className="more-icon"
                                    title={
                                        `${t(
                                            `formElements:teacher_wish_day`
                                        )}: ` +
                                        t(
                                            `day_of_week_${lesson.day.name.toUpperCase()}`
                                        ).toLowerCase() +
                                        `\n${t(`teacher_wish_week`)}: ` +
                                        t(`week_${lesson.week}_title`) +
                                        `\n${t('class_schedule')}: ` +
                                        lesson.classNumber.class_name
                                    }
                                />
                                {itemInBoard(group, lesson, index)}
                            </Board>
                        </div>
                    ))}
                </section>
            ))}
        </section>
    );
};

export default Schedule;
