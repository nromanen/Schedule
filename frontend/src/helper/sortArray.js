export const sortByAvailability = (arr) => {
    arr.sort((item, secondItem) => {
        if (item === secondItem) {
            return 0;
        }
        if (item) {
            return 1;
        }
        return -1;
    });
    return arr;
};
