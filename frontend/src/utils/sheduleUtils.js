import { isEmpty } from 'lodash';
import { getFullSchedule, getGroupSchedule, getTeacherSchedule } from '../services/scheduleService';

const getScheduleByType = (entityId, semesterId) => ({
    group: () => getGroupSchedule(entityId, semesterId),
    teacher: () => getTeacherSchedule(entityId, semesterId),
    full: () => getFullSchedule(),
});

const isNotReadySchedule = (schedule, loading) => isEmpty(schedule) && !loading;

export { getScheduleByType, isNotReadySchedule };
