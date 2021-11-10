import React from 'react';
import { isEmpty } from 'lodash';
import Card from '@material-ui/core/Card';
import './TableItem.scss';
import { addClassDayBoard, removeClassDayBoard } from '../../../helper/schedule';
import { GroupTitle } from './GroupTitle';

const TableItem = (props) => {
    const { classes, schedule, index } = props;

    const findItemInArray = (array, equalTo) => {
        return array.find((classItem) => classItem.class_id === equalTo);
    };

    const getColorByFullness = (array = []) => {
        let color = isEmpty(array) ? 'available' : 'allow';
        let prevLesson = {
            teacherName: array[0]?.teacher_for_site,
            lessonName: array[0]?.subject_for_site,
        };
        array.forEach((lesson) => {
            const isTeacherNameTheSame = lesson.teacher_for_site === prevLesson.teacherName;
            const isLessonNotTheSame = lesson.subject_for_site !== prevLesson.lessonName;
            if (isLessonNotTheSame && isTeacherNameTheSame) {
                color = 'possible';
            }
            if (!isTeacherNameTheSame) {
                color = 'not-allow';
            }
            prevLesson = {
                teacherName: lesson.teacher_for_site,
                lessonName: lesson.subject_for_site,
            };
        });
        return color;
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
                className="class-container"
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
