import React from 'react';

const WeekRoomInfo = ({ currentSemester, schedule, index, type = 'odd' }) => {
    const conflictLesson = 'more-then-one-conflict';
    const grouppedLesson = 'more-then-one';
    return currentSemester.semester_classes.map((scheduleClass) => {
        let inArrayIndex = -1;
        inArrayIndex =
            type === 'odd'
                ? schedule.classes[0].odd.findIndex(
                      (classItem) => classItem.class_id === scheduleClass.id,
                  )
                : schedule.classes[0].even.findIndex(
                      (classItem) => classItem.class_id === scheduleClass.id,
                  );
        const classOne =
            type === 'odd'
                ? schedule.classes[0].odd.find(
                      (classItem) => classItem.class_id === scheduleClass.id,
                  )
                : schedule.classes[0].even.find(
                      (classItem) => classItem.class_id === scheduleClass.id,
                  );
        if (inArrayIndex < 0 || !classOne || classOne.lessons.length <= 0) {
            return (
                <div className="class-info" key={index + scheduleClass.class_name}>
                    <div className="class-info-data class-number">{scheduleClass.class_name}</div>
                    <div className="class-info-data">
                        <div className="green-free"></div>
                    </div>
                </div>
            );
        }
        let intersectClass = '';
        if (classOne && classOne.lessons && classOne.lessons.length > 1) {
            intersectClass = conflictLesson;
        }
        let grouppedLessonClass = '';
        classOne.lessons.forEach((lessonOne) => {
            grouppedLessonClass = lessonOne.groups.length > 1 ? grouppedLesson : '';
        });
        return (
            <div className="class-info" key={index + classOne.class_name + classOne.group_name}>
                <div className="class-info-data class-number">{classOne.class_name}</div>
                <div
                    className={`class-info-data group-height ${grouppedLessonClass}${intersectClass}`}
                >
                    {classOne.lessons.map((lessonOne) => {
                        return lessonOne.groups.map((groupItem) => {
                            const hoverInfo =
                                lessonOne.teacher_for_site + lessonOne.subject_for_site;
                            return (
                                <p title={hoverInfo} key={hoverInfo + lessonOne.name}>
                                    {groupItem.group_name}
                                </p>
                            );
                        });
                    })}
                </div>
            </div>
        );
    });
};

export default WeekRoomInfo;
