import axios from '../helper/axios';
import {CLASS_URL} from '../constants/axios';

export const fetchClasses = () =>
    axios.get(CLASS_URL).then(res => res.data);

export const createClass = (item) =>
    axios.post(CLASS_URL, item).then(res => res.data);

export const updateClass = (item) =>
    axios.put(CLASS_URL, item).then(res => res.data);

export const deleteClass = (id) =>
    axios.delete(`${CLASS_URL}/${id}`).then(res => res.data);