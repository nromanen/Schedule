export const search = (items, term, arr) => {
    if (term.length === 0) return items;

    return items.filter((item) => {
        for (let i = 0; i < arr.length; i++) {
            if (String(item[arr[i]]).toLowerCase().indexOf(term.toLowerCase()) > -1) return true;
        }
        return false;
    });
};
