import {call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {isEmpty} from 'lodash';
import {addItemToSchedule, setLoading, setScheduleLoading, setSemesterLoading} from '../actions';
import * as actionTypes from '../actions/actionsType';
import {setMainScheduleLoading, setScheduleOperationLoading} from '../actions/loadingIndicator';
import {setScheduleNotPublished, setScheduleDepartment, updateScheduleItemSuccess} from '../actions/schedule';
import {
    CLEAR_SCHEDULE_URL,
    CURRENT_SEMESTER_URL,
    FOR_TEACHER_SCHEDULE_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    PUBLIC_SEMESTERS_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEM_ROOM_CHANGE,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_SEMESTER_ITEMS_URL,
    SEND_PDF_TO_EMAIL,
    TEACHER_SCHEDULE_URL, TEACHER_ACTIVE_SEMESTERS_SCHEDULE_URL,
} from '../constants/axios';
import {setOpenErrorSnackbar, setOpenSuccessSnackbar} from '../actions/snackbar';
import {COMMON_SCHEDULE_TITLE, NO_CURRENT_SEMESTER_ERROR,} from '../constants/translationLabels/common';
import {FORM_SCHEDULE_LABEL} from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    CLEARED_LABEL,
    SERVICE_MESSAGE_SENT_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {createErrorMessage, createMessage} from '../utils/sagaUtils';
import {
    checkAvailabilityScheduleSuccess,
    deleteScheduleItemSuccess,
    getAllPublicSemestersSuccess,
    getCurrentSemesterSuccess,
    getDefaultSemesterSuccess,
    getFullScheduleSuccess,
    getGroupScheduleSuccess,
    getScheduleItemsSuccess,
    getTeacherRangeScheduleSuccess,
    getTeacherScheduleSuccess,
    setScheduleGroup,
    setScheduleSemester,
    setScheduleTeacher,
    setScheduleType,
} from '../actions/schedule';
import i18n from '../i18n';
import {axiosCall} from '../services/axios';
import {DELETE, POST, PUT} from '../constants/methods';
import {FULL, GROUP, TEACHER, DEPARTMENT} from '../constants/scheduleTypes';
import {getAllPublicGroups} from './group';
import {getAllPublicTeachers} from './teachers';

export function* getScheduleItemsBySemester({ semesterId }) {
    const requestUrl = `${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getScheduleItemsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleLoading(false));
    }
}

export function* getScheduleItems() {
    try {
        const { data } = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(getCurrentSemesterSuccess(data));
        const { id } = data;
        yield call(getScheduleItemsBySemester, { semesterId: id });
    } catch (error) {
        yield put(setOpenErrorSnackbar(i18n.t(NO_CURRENT_SEMESTER_ERROR)));
        yield put(setLoading(false));
    }
}

export function* addItemsToSchedule({ item }) {
    try {
        yield put(setScheduleOperationLoading(true));
        const { data } = yield call(axiosCall, SCHEDULE_ITEMS_URL, POST, item);
        for (const schedule of data) {
            yield put(addItemToSchedule(schedule));
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleOperationLoading(false));
    }
}

export function* checkAvailabilityChangeRoomSchedule({ item }) {
    const { periodId, dayOfWeek, evenOdd, semesterId } = item;
    const requestUrl = `${ROOMS_AVAILABILITY}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(
            checkAvailabilityScheduleSuccess({
                classSuitsToTeacher: true,
                teacherAvailable: true,
                rooms: data,
            }),
        );
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* checkScheduleItemAvailability({ item }) {
    const { periodId, dayOfWeek, evenOdd, lessonId, semesterId } = item;
    const requestUrl = `${SCHEDULE_CHECK_AVAILABILITY_URL}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&lessonId=${lessonId}&semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(checkAvailabilityScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* clearSchedule({ semesterId }) {
    try {
        const requestUrl = `${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`;
        yield call(axiosCall, requestUrl, DELETE);
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            COMMON_SCHEDULE_TITLE,
            CLEARED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
        yield call(getScheduleItems);
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
        yield put(setLoading(false));
    }
}

export function* deleteScheduleItem({ itemId }) {
    try {
        yield put(setScheduleOperationLoading(true));

        const items = yield select((state) => state.schedule.items);
        const itemToDelete = items.find((item) => item.id === itemId);
        const groupId = itemToDelete?.lesson?.group?.id;

        const requestUrl = `${SCHEDULE_ITEMS_URL}/${itemId}`;
        const { data } = yield call(axiosCall, requestUrl, DELETE);
        for (const deletedId of data) {
            yield put(deleteScheduleItemSuccess(deletedId));
        }

        if (groupId) {
            yield put({ type: actionTypes.GET_LESSONS_CARDS_START, id: groupId });
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleOperationLoading(false));
    }
}

export function* editRoomItemToSchedule({ item }) {
    try {
        yield put(setScheduleOperationLoading(true));
        const { roomId, itemId } = item;
        const requestUrl = `${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${roomId}&scheduleId=${itemId}`;
        const { data } = yield call(axiosCall, requestUrl, PUT);
        for (const schedule of data) {
            yield put(updateScheduleItemSuccess(schedule));
        }
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            COMMON_SCHEDULE_TITLE,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleOperationLoading(false));
    }
}

export function* getAllPublicSemesters() {
    try {
        const { data } = yield call(axiosCall, PUBLIC_SEMESTERS_URL);
        yield put(getAllPublicSemestersSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getCurrentSemester() {
    try {
        const { data } = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(getCurrentSemesterSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setSemesterLoading(false));
    }
}

export function* getDefaultSemester() {
    try {
        let semesters = yield select(getSemestersFromState);
        if (isEmpty(semesters)) {
            yield call(getAllPublicSemesters);
            semesters = yield select(getSemestersFromState);
        }
        const defaultSemester = semesters.find((s) => s.defaultSemester === true);
        yield put(getDefaultSemesterSuccess(defaultSemester));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setSemesterLoading(false));
    }
}

export function* getFullSchedule({ semesterId }) {
    const requestUrl = FULL_SCHEDULE_URL + semesterId;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);

        if (data.published === false) {
            yield put(setScheduleNotPublished(data.message));
            return;
        }

        yield put(getFullScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* getGroupSchedule({ groupId, semesterId }) {
    const requestUrl = `${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);

        if (data.published === false) {
            yield put(setScheduleNotPublished(data.message));
            return;
        }

        yield put(getGroupScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* getTeacherRangeSchedule({ values }) {
    try {
        const { startDay, endDay } = values;
        const fromUrlPart = startDay.replace(/\//g, '-');
        const toUrlPart = endDay.replace(/\//g, '-');
        const requestUrl = `${FOR_TEACHER_SCHEDULE_URL}?from=${fromUrlPart}&to=${toUrlPart}`;
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getTeacherRangeScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* getTeacherSchedule({ teacherId, semesterId }) {
    const requestUrl = `${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);

        if (data.published === false) {
            yield put(setScheduleNotPublished(data.message));
            return;
        }
        yield put(getTeacherScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* selectTeacherActiveSemestersSchedule({ teacherId }) {
    const teachers = yield select((state) => state.teachers.teachers);
    if (isEmpty(teachers)) yield call(getAllPublicTeachers);

    yield put(setScheduleType(TEACHER));
    const allTeachers = yield select((state) => state.teachers.teachers);
    const teacher = allTeachers.find((item) => item.id === Number(teacherId));
    yield put(setScheduleTeacher(teacher));

    yield call(getTeacherActiveSemestersSchedule, { teacherId });
}

export function* getTeacherActiveSemestersSchedule({ teacherId }) {
    const requestUrl = `${TEACHER_ACTIVE_SEMESTERS_SCHEDULE_URL}${teacherId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);

        if (data.published === false) {
            yield put(setScheduleNotPublished(data.message));
            return;
        }

        yield put(getTeacherScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* sendTeacherSchedule({ data }) {
    try {
        const teachersId = data.teachersId.map((teacherId) => `teachersId=${teacherId}`).join('&');
        const { semesterId, language } = data;
        const requestUrl = `${SEND_PDF_TO_EMAIL}/semester/${semesterId}?language=${language}&${teachersId}`;
        yield call(axiosCall, requestUrl);
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SCHEDULE_LABEL,
            SERVICE_MESSAGE_SENT_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

const getSemestersFromState = (state) => state.schedule.semesters;

// Refactor required: consider splitting into separate sagas per schedule type
// to avoid loading unnecessary data (e.g. teachers for department schedule)
function* setSemesterAndType(semesterId, type) {
    let semesters = yield select(getSemestersFromState);
    if (isEmpty(semesters)) {
        yield call(getAllPublicSemesters);
        semesters = yield select(getSemestersFromState);
    }
    const semester = semesters.find((item) => item.id === Number(semesterId));

    const teachers = yield select((state) => state.teachers.teachers);
    if (isEmpty(teachers)) yield call(getAllPublicTeachers);

    const groups = yield select((state) => state.groups.groups);
    if (isEmpty(groups)) yield call(getAllPublicGroups, { id: semesterId });

    yield put(setScheduleSemester(semester));
    yield put(setScheduleType(type));
}
export function* selectGroupSchedule({ semesterId, groupId }) {
    yield call(setSemesterAndType, semesterId, GROUP);
    const groups = yield select((state) => state.groups.groups);
    const scheduleGroups = yield select((state) => state.groups.scheduleGroups);
    const group = groups.find((item) => item.id === Number(groupId))
        || scheduleGroups.find((item) => item.id === Number(groupId))
        || { id: Number(groupId) };
    yield put(setScheduleGroup(group));
    yield call(getGroupSchedule, { semesterId, groupId });
}
export function* selectTeacherSchedule({ semesterId, teacherId }) {
    yield call(setSemesterAndType, semesterId, TEACHER);
    const teachers = yield select((state) => state.teachers.teachers);
    const teacher = teachers.find((item) => item.id === Number(teacherId));
    yield put(setScheduleTeacher(teacher));
    yield call(getTeacherSchedule, { semesterId, teacherId });
}
export function* selectDepartmentSchedule({ semesterId, departmentId }) {
    const currentSemesterId = yield select((state) => state.schedule.scheduleSemester?.id);
    const hasFullSchedule = yield select((state) => !isEmpty(state.schedule.fullSchedule?.resultArray));

    yield call(setSemesterAndType, semesterId, DEPARTMENT);
    const departments = yield select((state) => state.departments.departments);
    const department = departments.find((item) => item.id === Number(departmentId));
    yield put(setScheduleDepartment(department));

    if (!hasFullSchedule || currentSemesterId !== Number(semesterId)) {
        yield call(getFullSchedule, { semesterId });
    }
}

export function* selectFullSchedule({ semesterId }) {
    const currentSemesterId = yield select((state) => state.schedule.scheduleSemester?.id);
    const hasFullSchedule = yield select((state) => !isEmpty(state.schedule.fullSchedule?.resultArray));

    yield call(setSemesterAndType, semesterId, FULL);

    if (!hasFullSchedule || currentSemesterId !== Number(semesterId)) {
        yield call(getFullSchedule, { semesterId });
    }
}

export function* moveScheduleItem({ item }) {
    try {
        yield put(setScheduleOperationLoading(true));
        const { scheduleId, roomId, dayOfWeek, periodId, evenOdd } = item;
        const requestUrl = `${SCHEDULE_ITEMS_URL}/move?scheduleId=${scheduleId}&roomId=${roomId}&dayOfWeek=${dayOfWeek}&periodId=${periodId}&evenOdd=${evenOdd}`;
        const { data } = yield call(axiosCall, requestUrl, PUT);
        for (const schedule of data) {
            yield put(updateScheduleItemSuccess(schedule));
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleOperationLoading(false));
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
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_SEMESTERS_START, getAllPublicSemesters);
    yield takeLatest(actionTypes.SEND_TEACHER_SCHEDULE_START, sendTeacherSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_ACTIVE_SEMESTERS_SCHEDULE_START, selectTeacherActiveSemestersSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_RANGE_SCHEDULE_START, getTeacherRangeSchedule);
    yield takeLatest(actionTypes.GET_ALL_SCHEDULE_ITEMS_START, getScheduleItems);
    yield takeEvery(actionTypes.ADD_ITEM_TO_SCHEDULE_START, addItemsToSchedule);
    yield takeEvery(actionTypes.EDIT_ITEM_TO_SCHEDULE_START, editRoomItemToSchedule);
    yield takeEvery(actionTypes.DELETE_SCHEDULE_ITEM_START, deleteScheduleItem);
    yield takeEvery(actionTypes.CLEAR_SCHEDULE_START, clearSchedule);
    yield takeLatest(actionTypes.GET_GROUP_SCHEDULE_START, getGroupSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_SCHEDULE_START, getTeacherSchedule);
    yield takeLatest(actionTypes.SELECT_GROUP_SCHEDULE_START, selectGroupSchedule);
    yield takeLatest(actionTypes.SELECT_TEACHER_SCHEDULE_START, selectTeacherSchedule);
    yield takeLatest(actionTypes.SELECT_FULL_SCHEDULE_START, selectFullSchedule);
    yield takeLatest(actionTypes.SELECT_DEPARTMENT_SCHEDULE_START, selectDepartmentSchedule);
    yield takeEvery(actionTypes.MOVE_SCHEDULE_ITEM_START, moveScheduleItem);
}

