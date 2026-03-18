import axios from '../helper/axios';
import { GROUPS_URL, DISABLED_GROUPS_URL, GROUPS_AFTER_URL, GROUP_URL, GROUPS_FOR_CURRENT_SCHEDULE } from '../constants/axios';

export const fetchEnabledGroups = () =>
    axios.get(GROUPS_URL).then(res => res.data);

export const fetchDisabledGroups = () =>
    axios.get(DISABLED_GROUPS_URL).then(res => res.data);

export const fetchGroupsForCurrentSemester = () =>
    axios.get(GROUPS_FOR_CURRENT_SCHEDULE).then(res => res.data);

export const createGroup = (group) =>
    axios.post(GROUPS_AFTER_URL, group).then(res => res.data);

export const updateGroup = (group) =>
    axios.put(GROUPS_AFTER_URL, group).then(res => res.data);

export const deleteGroup = (id) =>
    axios.delete(`${GROUP_URL}/${id}`).then(res => res.data);