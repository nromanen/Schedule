import { store } from '../store';

import axios from '../helper/axios';
import i18n from '../i18n';
import { errorHandler } from '../helper/handlerAxios';
import {
    setCurrentSemester,
    setFullSchedule,
    setGroupSchedule,
    setScheduleGroupId,
    setScheduleSemesterId,
    setScheduleTeacherId,
    setScheduleType,
    setTeacherSchedule,
} from '../actions/index';

import { setLoadingService } from './loadingService';
import { handleSnackbarOpenService } from './snackbarService';
import {
    CURRENT_SEMESTER_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    TEACHER_SCHEDULE_URL,
} from '../constants/axios';
import { snackbarTypes } from '../constants/snackbarTypes';
import { showBusyRooms } from './busyRooms';
import { NO_CURRENT_SEMESTER_ERROR } from '../constants/translationLabels/common';
import { getScheduleItemsRequested } from '../actions/schedule';
// ALERT GONNA BE DELETED
export const getScheduleItemsService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then((response) => {
            store.dispatch(setCurrentSemester(response.data));
            store.dispatch(getScheduleItemsRequested(response.data.id)); // saga
            showBusyRooms(response.data.id);
        })
        .catch(() => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, i18n.t(NO_CURRENT_SEMESTER_ERROR));
            setLoadingService(false);
        });
};
// ALERT GONNA BE DELETED
export const setScheduleSemesterIdService = (semesterId) => {
    store.dispatch(setScheduleSemesterId(semesterId));
};
// ALERT GONNA BE DELETED
export const setScheduleTypeService = (item) => {
    store.dispatch(setScheduleType(item));
};
// ALERT GONNA BE DELETED
export const setScheduleGroupIdService = (groupId) => {
    store.dispatch(setScheduleGroupId(groupId));
};
// ALERT GONNA BE DELETED
export const setScheduleTeacherIdService = (teacherId) => {
    store.dispatch(setScheduleTeacherId(teacherId));
};

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

export const getGroupSchedule = (groupId, semesterId) => {
    if (groupId > 0) {
        axios
            .get(`${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`)
            .then((response) => {
                store.dispatch(setGroupSchedule(response.data));
                setLoadingService(false);
            })
            .catch((err) => errorHandler(err));
    }
};
