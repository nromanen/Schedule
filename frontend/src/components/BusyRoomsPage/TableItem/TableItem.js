import React from 'react';
import i18n from 'i18next';
import { isEmpty } from 'lodash';
import Card from '@material-ui/core/Card';
import './TableItem.scss';
import { WEEK_ODD_TITLE, WEEK_EVEN_TITLE } from '../../../constants/translationLabels/common';
import { addClassDayBoard, removeClassDayBoard } from '../../../helper/schedule';

const TableItem = (props) => {
    const { classes, schedule, index } = props;
    const getClassLessons = (lessonArray) => {
        return lessonArray.map((lessonOne) => {
            return (
                <span key={`${lessonOne.name}`} className="group-list">
                    {lessonOne.groups.map((groupItem) => {
                        const hoverInfo = `${lessonOne.teacher_for_site} / ${lessonOne.subject_for_site}`;
                        return (
                            <h5 title={hoverInfo} key={`${hoverInfo}`}>
                                {groupItem.group_name}
                            </h5>
                        );
                    })}
                </span>
            );
        });
    };
    const findIndexInArray = (array, equalTo) => {
        return array.findIndex((classItem) => classItem.class_id === equalTo);
    };
    const findItemInArray = (array, equalTo) => {
        return array.find((classItem) => classItem.class_id === equalTo);
    };
    const getClassNameByArraySize = (arraySize) => {
        if (arraySize > 4) {
            return 'not-allow';
        }
        if (arraySize > 0) {
            return 'possible';
        }
        return 'allow';
    };

    return classes.map((scheduleClass, classesIndex) => {
        const inArrayIndex =
            findIndexInArray(schedule.classes[0].odd, scheduleClass.id) === -1 ||
            findIndexInArray(schedule.classes[0].even, scheduleClass.id) === -1;

        const classOdd = findItemInArray(schedule.classes[0].odd, scheduleClass.id);
        const classEven = findItemInArray(schedule.classes[0].even, scheduleClass.id);
        return (
            <section
                key={`${index}_${classesIndex.toString()}`}
                onMouseOver={() => addClassDayBoard(schedule.day, scheduleClass.class_name)}
                onFocus={() => addClassDayBoard(schedule.day, scheduleClass.class_name)}
                onMouseOut={() => removeClassDayBoard(schedule.day, scheduleClass.class_name)}
                onBlur={() => removeClassDayBoard(schedule.day, scheduleClass.class_name)}
                className="class-container"
            >
                <div className="class-info-container">
                    <Card
                        className={`card class-info-data ${getClassNameByArraySize(
                            classOdd?.lessons.length,
                        )}`}
                    >
                        <p className="week-type">{i18n.t(WEEK_ODD_TITLE)}</p>
                        {inArrayIndex || !classOdd || isEmpty(classOdd.lessons) ? (
                            <> </>
                        ) : (
                            getClassLessons(classOdd.lessons)
                        )}
                    </Card>
                </div>

                <div className="class-info-container">
                    <Card
                        className={`card class-info-data ${getClassNameByArraySize(
                            classEven?.lessons.length,
                        )}`}
                    >
                        <p className="week-type">{i18n.t(WEEK_EVEN_TITLE)}</p>
                        {inArrayIndex || !classEven || isEmpty(classEven.lessons) ? (
                            <> </>
                        ) : (
                            getClassLessons(classEven.lessons)
                        )}
                    </Card>
                </div>
            </section>
        );
    });
};

export default TableItem;
