import axios from '../helper/axios';

import { DISABLED_GROUPS_URL, GROUP_URL } from '../constants/axios';

export const getDisabledGroupsApi = () => {
    return axios.get(DISABLED_GROUPS_URL).then((res) => {
        return res;
    });
};

export const getEnabledGroupsApi = () => {
    return axios.get(GROUP_URL).then((res) => {
        return res;
    });
};

export const deleteGroupApi = (id) => {
    return axios.delete(`${GROUP_URL}/${id}`);
};

export const createGroupApi = (data) => {
    return axios.post(GROUP_URL, data).then((res) => {
        return res;
    });
};

export const updateGroupApi = (data) => {
    return axios.put(GROUP_URL, data).then((res) => {
        return res;
    });
};
