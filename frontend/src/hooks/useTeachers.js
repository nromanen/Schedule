import { useQuery } from '@tanstack/react-query';
import {fetchPublicTeachersByDepartment} from "../api/teacherApi";

export const PUBLIC_TEACHERS_QUERY_KEY = 'publicTeachersByDepartment';

export const usePublicTeachersByDepartment = (departmentId, options = {}) =>
    useQuery({
        queryKey: [PUBLIC_TEACHERS_QUERY_KEY, departmentId],
        queryFn: () => fetchPublicTeachersByDepartment(departmentId),
        enabled: !!departmentId,
        ...options,
    });