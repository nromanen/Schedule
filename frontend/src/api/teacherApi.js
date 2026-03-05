import axios from '../helper/axios';
import { DEPARTMENT_URL, TEACHER_URL } from '../constants/axios';

export const fetchPublicTeachersByDepartment = (departmentId) =>
    axios.get(`${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`).then(res => res.data);