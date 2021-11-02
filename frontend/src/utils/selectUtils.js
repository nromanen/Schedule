import { isEmpty } from 'lodash';

export const getGroupsOptionsForSelect = (groupOptions) => {
    if (!isEmpty(groupOptions)) {
        return groupOptions.map((item) => {
            return { id: item.id, value: item.id, label: `${item.title}` };
        });
    }
    return groupOptions;
};
