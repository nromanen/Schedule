import {get} from 'lodash';
import {getTeacherWithPosition} from '../helper/renderTeacher';
import { toShortLocalDate } from './dateUtils';

export const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const sameYear = startDate?.slice(-4) === endDate?.slice(-4);
    const start = toShortLocalDate(startDate, !sameYear);
    const end = toShortLocalDate(endDate, true);
    return `${start} – ${end}`;
};

const getSemesterTitle = (semester) => {
    if (!semester) return '';
    const { description, startDay, endDay } = semester;
    return `${description} (${formatDateRange(startDay, endDay)}) : `;
};

export { getSemesterTitle };

