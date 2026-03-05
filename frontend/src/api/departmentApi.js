import axios from '../helper/axios';
import { DEPARTMENT_URL } from '../constants/axios';

export const fetchDepartments = () =>
    axios.get(DEPARTMENT_URL).then(res => res.data);

export const fetchDisabledDepartments = () =>
    axios.get(`${DEPARTMENT_URL}/disabled`).then(res => res.data);

export const createDepartment = (item) =>
    axios.post(DEPARTMENT_URL, item).then(res => res.data);

export const updateDepartment = (item) =>
    axios.put(DEPARTMENT_URL, item).then(res => res.data);

export const deleteDepartment = (id) =>
    axios.delete(`${DEPARTMENT_URL}/${id}`).then(res => res.data);