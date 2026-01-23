import React from 'react';
import {isEmpty} from 'lodash';
import Card from '@material-ui/core/Card';
import './TableItem.scss';
import {addClassDayBoard, getColorByFullness, removeClassDayBoard,} from '../../../helper/schedule';
import {GroupTitle} from './GroupTitle';

const TableItem = (props) => {
    const { classes, schedule, index, columnsSize } = props;

    const findItemInArray = (array, equalTo) => {
        return array.find((classItem) => classItem.class_id === equalTo);
    };

    return classes.map((scheduleClass, classIndex) => {
        const classOdd = findItemInArray(schedule.classes[0].odd, scheduleClass.id);
        const classEven = findItemInArray(schedule.classes[0].even, scheduleClass.id);

        return (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <section
                key={`${index}_${classIndex.toString()}`}
                onMouseOver={() => addClassDayBoard(schedule.day, scheduleClass.class_name)}
                onMouseOut={() => removeClassDayBoard(schedule.day, scheduleClass.class_name)}
                className={`class-container responsive-table-column-${columnsSize}`}
            >
                <div className="class-info-container">
                    <Card
                        className={`schedule-card class-info-data ${getColorByFullness(
                            classOdd?.lessons,
                        )}`}
                    >
                        <div className="group-list-container">
                            {!classOdd || isEmpty(classOdd.lessons) ? (
                                <> </>
                            ) : (
                                <GroupTitle lessonArray={classOdd.lessons} />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="class-info-container">
                    <Card
                        className={`schedule-card class-info-data ${getColorByFullness(
                            classEven?.lessons,
                        )}`}
                    >
                        <div className="group-list-container">
                            {!classEven || isEmpty(classEven.lessons) ? (
                                <> </>
                            ) : (
                                <GroupTitle lessonArray={classEven.lessons} />
                            )}
                        </div>
                    </Card>
                </div>
            </section>
        );
    });
};

export default TableItem;
