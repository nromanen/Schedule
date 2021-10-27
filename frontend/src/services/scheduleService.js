import { store } from '../store';

import axios from '../helper/axios';
import { errorHandler } from '../helper/handlerAxios';
import { setFullSchedule, setGroupSchedule, setTeacherSchedule } from '../actions/index';

import { setLoadingService } from './loadingService';
import { FULL_SCHEDULE_URL, GROUP_SCHEDULE_URL, TEACHER_SCHEDULE_URL } from '../constants/axios';

export const getTeacherSchedule = (teacherId, semesterId) => {
    if (teacherId > 0) {
        axios
            .get(`${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`)
            .then((response) => {
                store.dispatch(setTeacherSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};

export const getFullSchedule = (semesterId) => {
    if (semesterId !== undefined)
        axios
            .get(FULL_SCHEDULE_URL + semesterId)
            .then((response) => {
                store.dispatch(setFullSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
};

// export const getGroupSchedule = (groupId, semesterId) => {
//     if (groupId > 0) {
//         axios
//             .get(`${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`)
//             .then((response) => {
//                 store.dispatch(setGroupSchedule(response.data));
//                 setLoadingService(false);
//             })
//             .catch((err) => errorHandler(err));
//     }
// };
