import { daysUppercase } from '../constants/schedule/days';

export const getToday = () => {
    return new Date();
};
export const getTomorrow = () => {
    const tomorrow = new Date(getToday());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

export const initialCheckboxesStateForDays = daysUppercase.reduce((init, item) => {
    const isCheckedDays = init;
    isCheckedDays[item] = false;
    return isCheckedDays;
}, {});

export const createClasslabel = (lessons, classItem) => {
    const item = lessons.find((lesson) => lesson.id === +classItem);
    return `${item.class_name} (${item.startTime}-${item.endTime})`;
};
