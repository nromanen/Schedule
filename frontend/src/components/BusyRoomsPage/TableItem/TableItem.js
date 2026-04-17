import React from 'react';
import { isEmpty } from 'lodash';
import Card from '@mui/material/Card';
import './TableItem.scss';
import { getColorByFullnessMultiSemester } from '../../../helper/schedule';
import { GroupTitle } from './GroupTitle';

const TableItem = (props) => {
    const { classes, schedule, index, columnsSize } = props;

    const findItemInArray = (array, equalTo) => {
        return array.find((classItem) => classItem.class_id === equalTo);
    };

    return classes.map((scheduleClass, classIndex) => {
        const classOdd  = findItemInArray(schedule.classes[0].odd,  scheduleClass.id);
        const classEven = findItemInArray(schedule.classes[0].even, scheduleClass.id);

        return (
            <section
                key={`${index}_${classIndex.toString()}`}
                className={`class-container responsive-table-column-${columnsSize}`}
            >
                <div className="class-info-container">
                    <Card
                        className={`schedule-card class-info-data ${getColorByFullnessMultiSemester(
                            classOdd?.lessons,
                        )}`}
                    >
                        <div className="group-list-container">
                            {!classOdd || isEmpty(classOdd.lessons) ? (
                                <></>
                            ) : (
                                <GroupTitle lessonArray={classOdd.lessons} />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="class-info-container">
                    <Card
                        className={`schedule-card class-info-data ${getColorByFullnessMultiSemester(
                            classEven?.lessons,
                        )}`}
                    >
                        <div className="group-list-container">
                            {!classEven || isEmpty(classEven.lessons) ? (
                                <></>
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