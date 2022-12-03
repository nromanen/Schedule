import { get } from 'lodash';
import { getTeacherWithPosition } from '../helper/renderTeacher';
import {t} from "i18next";
export const printWeekNumber = (startScheduleDate=new Date()) => {
    const date = new Date();
    const monday = new Date(startScheduleDate);
    while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() - 1);
    }
    return((date - monday) % 14);
};

export function isWeekOdd(num) {
    return num >= 1 && num <= 7;
}
const getOddEvenTitle=()=>{
    return isWeekOdd(printWeekNumber())?t('common:odd_week'):t('common:even_week');
}
const getSemesterTitle = (semester) => {
    if (!semester) return '';
    const { description, startDay, endDay } = semester;

    return `${description} (${startDay}-${endDay}) ${getOddEvenTitle()} : `;
};

const getGroupScheduleTitle = (semester, group) => {
    const semesterTitle = getSemesterTitle(semester);

    return group ? semesterTitle + get(group, 'title', '') : semesterTitle;
};

const getTeacherScheduleTitle = (semester, teacher) => {
    const semesterTitle = getSemesterTitle(semester);

    return teacher ? semesterTitle + getTeacherWithPosition(teacher) : semesterTitle;
};

export { getSemesterTitle, getGroupScheduleTitle, getTeacherScheduleTitle, getOddEvenTitle };
