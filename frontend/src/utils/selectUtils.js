import i18n from '../i18n';
import { COMMON_AVAILABLE, COMMON_UNAVAILABLE } from '../constants/translationLabels/common';

export const getGroupsOptionsForSelect = (groupOptions) => {
    return groupOptions.map((item) => {
        return { id: item.id, value: item.id, label: `${item.title}` };
    });
};

export const getOptionLabelWithAvailable = (option) => {
    return `${option.name} (${
        option.available ? i18n.t(COMMON_AVAILABLE) : i18n.t(COMMON_UNAVAILABLE)
    })`;
};
