export const getGroupsOptionsForSelect = (groupOptions) => {
    return groupOptions.map((item) => {
        return { id: item.id, value: item.id, label: `${item.title}` };
    });
};