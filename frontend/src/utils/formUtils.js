export const getToday = () => {
    return new Date();
};
export const getTomorrow = () => {
    const tomorrow = new Date(getToday());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};
