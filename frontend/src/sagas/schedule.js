import { takeLatest, takeEvery, call, put } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionsType';
import { axiosCall } from '../services/axios';
import i18n from '../i18n';
import {
    CLEAR_SCHEDULE_URL,
    CURRENT_SEMESTER_URL,
    DEFAULT_SEMESTER_URL,
    DEPARTMENT_URL,
    FOR_TEACHER_SCHEDULE_URL,
    FULL_SCHEDULE_URL,
    GROUPS_URL,
    GROUP_SCHEDULE_URL,
    PUBLIC_SEMESTERS_URL,
    PUBLIC_TEACHER_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_ITEM_ROOM_CHANGE,
    SCHEDULE_SEMESTER_ITEMS_URL,
    SEMESTERS_URL,
    SEND_PDF_TO_EMAIL,
    TEACHER_SCHEDULE_URL,
    TEACHER_URL,
} from '../constants/axios';
import {
    checkAvailabilitySchedule,
    deleteItemFromSchedule,
    setCurrentSemester,
    setDefaultSemester,
    setFullSchedule,
    setGroupSchedule,
    setLoading,
    setOpenSnackbar,
    setScheduleItems,
    setScheduleLoading,
    setSemesterList,
    setSemesterLoading,
    setTeacherRangeSchedule,
    setTeacherSchedule,
    showAllGroups,
    showAllTeachers,
} from '../actions';
import { showBusyRooms } from '../services/busyRooms';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    COMMON_SCHEDULE_TITLE,
    NO_CURRENT_SEMESTER_ERROR,
} from '../constants/translationLabels/common';
import {
    BACK_END_SUCCESS_OPERATION,
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    CLEARED_LABEL,
    SERVICE_MESSAGE_GROUP_LABEL,
    SERVICE_MESSAGE_SENT_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { sortGroup } from '../helper/sortGroup';
import {
    FORM_CHOSEN_SEMESTER_LABEL,
    FORM_SCHEDULE_LABEL,
} from '../constants/translationLabels/formElements';
import { getAllTeachersByDepartmentId } from '../actions/teachers';
import { setMainScheduleLoading } from '../actions/loadingIndicator';

export function* getScheduleItemsBySemester({ semesterId }) {
    const requestUrl = `${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(setScheduleItems(response.data));
        yield put(setScheduleLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setScheduleLoading(false));
    }
}

export function* getScheduleItems() {
    try {
        const response = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(setCurrentSemester(response.data));
        yield call(showBusyRooms, response.data.id);
        yield call(getScheduleItemsBySemester, { semesterId: response.data.id });
    } catch (error) {
        const message = i18n.t(NO_CURRENT_SEMESTER_ERROR);
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}

export function* addItemsToSchedule({ item }) {
    try {
        yield call(axiosCall, SCHEDULE_ITEMS_URL, 'POST', item);
        yield call(getScheduleItems);
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* checkAvailabilityChangeRoomSchedule({ item }) {
    const { periodId, dayOfWeek, evenOdd, semesterId } = item;
    const requestUrl = `${ROOMS_AVAILABILITY}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&semesterId=${semesterId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(
            checkAvailabilitySchedule({
                classSuitsToTeacher: true,
                teacherAvailable: true,
                rooms: response.data,
            }),
        );
        yield put(setLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}

export function* checkScheduleItemAvailability({ item }) {
    const { periodId, dayOfWeek, evenOdd, lessonId, semesterId } = item;
    const requestUrl = `${SCHEDULE_CHECK_AVAILABILITY_URL}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&lessonId=${lessonId}&semesterId=${semesterId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(checkAvailabilitySchedule(response.data));
        yield put(setLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}

export function* clearSchedule({ semesterId }) {
    try {
        const requestUrl = `${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(COMMON_SCHEDULE_TITLE),
            actionType: i18n.t(CLEARED_LABEL),
        });
        const isOpen = true;
        const type = snackbarTypes.SUCCESS;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield call(getScheduleItems);
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}

export function* deleteScheduleItem({ itemId }) {
    try {
        const requestUrl = `${SCHEDULE_ITEMS_URL}/${itemId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        yield put(deleteItemFromSchedule(itemId));
        yield call(getScheduleItems);
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    }
}

export function* editRoomItemToSchedule({ item }) {
    try {
        const { roomId, itemId } = item;
        const requestUrl = `${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${roomId}&scheduleId=${itemId}`;
        yield call(axiosCall, requestUrl, 'PUT');
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(COMMON_SCHEDULE_TITLE),
            actionType: i18n.t(UPDATED_LABEL),
        });
        const isOpen = true;
        const type = snackbarTypes.SUCCESS;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield call(getScheduleItems);
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getAllPublicGroups({ id }) {
    try {
        if (id !== null && id !== undefined) {
            const requestUrl = `/${SEMESTERS_URL}/${id}/${GROUPS_URL}`;
            const response = yield call(axiosCall, requestUrl);
            const sortedGroups = response.data.sort((a, b) => sortGroup(a, b));
            yield put(showAllGroups(sortedGroups));
            if (response.data.length === 0) {
                const message = i18n.t(CHOSEN_SEMESTER_HAS_NOT_GROUPS, {
                    cardType: i18n.t(FORM_CHOSEN_SEMESTER_LABEL),
                    actionType: i18n.t(SERVICE_MESSAGE_GROUP_LABEL),
                });
                const isOpen = true;
                const type = snackbarTypes.INFO;
                yield put(setOpenSnackbar({ isOpen, type, message }));
            }
        }
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getAllPublicSemesters() {
    try {
        const response = yield call(axiosCall, PUBLIC_SEMESTERS_URL);
        yield put(setSemesterList(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getAllPublicTeachers() {
    try {
        const response = yield call(axiosCall, PUBLIC_TEACHER_URL);
        yield put(showAllTeachers(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getAllPublicTeachersByDepartment({ departmentId }) {
    const requestUrl = `${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        yield put(getAllTeachersByDepartmentId(response.data));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getCurrentSemester() {
    try {
        const response = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(setCurrentSemester(response.data));
        yield put(setSemesterLoading(false));
    } catch (error) {
        const message = i18n.t(NO_CURRENT_SEMESTER_ERROR);
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setSemesterLoading(false));
    }
}

export function* getDefaultSemester() {
    try {
        const response = yield call(axiosCall, DEFAULT_SEMESTER_URL);
        yield put(setSemesterLoading(false));
        yield put(setDefaultSemester(response.data));
    } catch (error) {
        const message = i18n.t(NO_CURRENT_SEMESTER_ERROR);
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setSemesterLoading(false));
    }
}

export function* getFullSchedule({ semesterId }) {
    const requestUrl = FULL_SCHEDULE_URL + semesterId;
    try {
        yield put(setMainScheduleLoading(true));
        const response = yield call(axiosCall, requestUrl);
        yield put(setFullSchedule(response.data));
        yield put(setMainScheduleLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setMainScheduleLoading(false));
    }
}

export function* getGroupSchedule({ groupId, semesterId }) {
    const requestUrl = `${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const response = yield call(axiosCall, requestUrl);
        yield put(setGroupSchedule(response.data));
        yield put(setMainScheduleLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setMainScheduleLoading(false));
    }
}

export function* getTeacherRangeSchedule({ values }) {
    try {
        const { startDay, endDay } = values;
        const fromUrlPart = startDay.replace(/\//g, '-');
        const toUrlPart = endDay.replace(/\//g, '-');
        const requestUrl = `${FOR_TEACHER_SCHEDULE_URL}?from=${fromUrlPart}&to=${toUrlPart}`;
        const response = yield call(axiosCall, requestUrl);
        yield put(setTeacherRangeSchedule(response.data));
        yield put(setLoading(false));
    } catch (error) {
        yield put(setLoading(false));
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export function* getTeacherSchedule({ teacherId, semesterId }) {
    const requestUrl = `${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const response = yield call(axiosCall, requestUrl);
        yield put(setTeacherSchedule(response.data));
        yield put(setMainScheduleLoading(false));
    } catch (error) {
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setMainScheduleLoading(false));
    }
}

export function* sendTeacherSchedule({ data }) {
    try {
        const teachersId = data.teachersId.map((teacherId) => `teachersId=${teacherId}`).join('&');
        const { semesterId, language } = data;
        const responseUrl = `${SEND_PDF_TO_EMAIL}/semester/${semesterId}?language=${language}&${teachersId}`;
        const response = yield call(axiosCall, responseUrl);
        console.log(response);
        const message = i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(FORM_SCHEDULE_LABEL),
            actionType: i18n.t(SERVICE_MESSAGE_SENT_LABEL),
        });
        const isOpen = true;
        const type = snackbarTypes.SUCCESS;
        yield put(setOpenSnackbar({ isOpen, type, message }));
        yield put(setLoading(false));
    } catch (error) {
        yield put(setLoading(false));
        const message = error.response
            ? i18n.t(error.response.data.message, error.response.data.message)
            : 'Error';
        const isOpen = true;
        const type = snackbarTypes.ERROR;
        yield put(setOpenSnackbar({ isOpen, type, message }));
    }
}

export default function* watchSchedule() {
    yield takeLatest(actionTypes.GET_CURRENT_SEMESTER_START, getCurrentSemester);
    yield takeLatest(actionTypes.GET_DEFAULT_SEMESTER_START, getDefaultSemester);
    yield takeLatest(actionTypes.CHECK_AVAILABILITY_SCHEDULE_START, checkScheduleItemAvailability);
    yield takeLatest(actionTypes.GET_SCHEDULE_ITEMS_START, getScheduleItemsBySemester);
    yield takeLatest(
        actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_START,
        checkAvailabilityChangeRoomSchedule,
    );
    yield takeLatest(
        actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_START,
        getAllPublicTeachersByDepartment,
    );
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_TEACHERS_START, getAllPublicTeachers);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_GROUPS_START, getAllPublicGroups);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_SEMESTERS_START, getAllPublicSemesters);
    yield takeLatest(actionTypes.SEND_TEACHER_SCHEDULE_START, sendTeacherSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_RANGE_SCHEDULE_START, getTeacherRangeSchedule);
    yield takeLatest(actionTypes.GET_ALL_SCHEDULE_ITEMS_START, getScheduleItems);
    yield takeEvery(actionTypes.ADD_ITEM_TO_SCHEDULE_START, addItemsToSchedule);
    yield takeEvery(actionTypes.EDIT_ITEM_TO_SCHEDULE_START, editRoomItemToSchedule);
    yield takeEvery(actionTypes.DELETE_SCHEDULE_ITEM_START, deleteScheduleItem);
    yield takeEvery(actionTypes.CLEAR_SCHEDULE_START, clearSchedule);
    yield takeLatest(actionTypes.GET_GROUP_SCHEDULE_START, getGroupSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_SCHEDULE_START, getTeacherSchedule);
    yield takeLatest(actionTypes.GET_FULL_SCHEDULE_START, getFullSchedule);
}
