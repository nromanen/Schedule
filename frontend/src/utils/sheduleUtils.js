import { isEmpty } from 'lodash';
import { getFullSchedule, getGroupSchedule, getTeacherSchedule } from '../services/scheduleService';

const getScheduleByType = (scheduleId, semesterId) => ({
    group: () => getGroupSchedule(scheduleId, semesterId),
    teacher: () => getTeacherSchedule(scheduleId, semesterId),
    full: () => getFullSchedule(),
});

const isNotReadySchedule = (schedule, loading) => isEmpty(schedule) && !loading;

export { getScheduleByType, isNotReadySchedule };
