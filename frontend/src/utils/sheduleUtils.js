import { isEmpty } from 'lodash';
// import { getFullSchedule, getGroupSchedule, getTeacherSchedule } from '../services/scheduleService';

const getScheduleByType = (entityId, semesterId) => ({
    // group: () => getGroupSchedule(entityId, semesterId),
    // teacher: () => getTeacherSchedule(entityId, semesterId),
    // full: () => getFullSchedule(),
});

const isNotReadySchedule = (schedule, loading) => isEmpty(schedule) && !loading;

const filterClassesArray = (inputArray) => {
    return inputArray.filter((item, index, array) => {
        const resIndex = array.findIndex((findItem) => findItem.id === item.id);
        return resIndex === index;
    });
};

export { getScheduleByType, isNotReadySchedule, filterClassesArray };
