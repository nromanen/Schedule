import axios from '../helper/axios';
import { SUBJECT_URL, DISABLED_SUBJECTS_URL } from '../constants/axios';

export const fetchSubjects = () =>
    axios.get(SUBJECT_URL).then(res => res.data);

export const fetchDisabledSubjects = () =>
    axios.get(DISABLED_SUBJECTS_URL).then(res => res.data);

export const createSubject = (item) =>
    axios.post(SUBJECT_URL, item).then(res => res.data);

export const updateSubject = (item) =>
    axios.put(SUBJECT_URL, item).then(res => res.data);

export const deleteSubject = (id) =>
    axios.delete(`${SUBJECT_URL}/${id}`).then(res => res.data);