import { reset } from 'redux-form';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
    DISABLED_TEACHERS_URL,
    TEACHERS_WITHOUT_ACCOUNT_URL,
    TEACHER_URL,
} from '../constants/axios';
import { DELETE, GET, POST, PUT } from '../constants/methods';
import { axiosCall } from '../services/axios';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_TEACHER_A_LABEL } from '../constants/translationLabels/formElements';
import { deleteTeacher, setDisabledTeachers, setLoading, showAllTeachers } from '../actions';
import { setOpenErrorSnackbar, setOpenSuccessSnackbar } from '../actions/snackbar';
import * as actionTypes from '../actions/actionsType';
import {
    getTeacherWithoutAccountSuccess,
    addTeacher,
    updateTeacherCard,
    selectTeacherCard,
} from '../actions/teachers';
import { isObjectEmpty } from '../helper/ObjectRevision';
import { TEACHER_FORM } from '../constants/reduxForms';

export function* showTeachers() {
    try {
        yield put(setLoading(true));
        const { data } = yield call(axiosCall, TEACHER_URL, GET);

        yield put(showAllTeachers(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* getDisabledTeachers() {
    try {
        const { data } = yield call(axiosCall, DISABLED_TEACHERS_URL, GET);

        yield put(setDisabledTeachers(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* removeTeacher({ id }) {
    try {
        const requestUrl = `${TEACHER_URL}/${id}`;
        yield call(axiosCall, requestUrl, DELETE);

        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_TEACHER_A_LABEL,
            DELETED_LABEL,
        );

        yield put(deleteTeacher(id));
        yield call(getDisabledTeachers);
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* createTeacher(teacher) {
    const results = { ...teacher };
    if (isObjectEmpty(teacher.department) || !teacher.department?.id) {
        delete results.department;
    }

    try {
        const { data } = yield call(axiosCall, TEACHER_URL, POST, results);

        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_TEACHER_A_LABEL,
            CREATED_LABEL,
        );

        yield put(addTeacher(data));
        yield put(reset(TEACHER_FORM));
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* updateTeacher({ teacher }) {
    const result = { ...teacher };

    if (isObjectEmpty(teacher.department) || !teacher.department?.id) {
        delete result.department;
    }
    try {
        const { data } = yield call(axiosCall, TEACHER_URL, PUT, result);

        yield put(updateTeacherCard(data));

        yield call(showTeachers);
        yield call(getDisabledTeachers);
        yield put(selectTeacherCard(null));

        yield put(reset(TEACHER_FORM));
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_TEACHER_A_LABEL,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

function* toggleDisabledTeacher({ teacherId, disableStatus }) {
    try {
        const state = yield select();
        const { teachers, disabledTeachers } = state.teachers;
        const teacher = [...teachers, ...disabledTeachers].find((item) => item.id === teacherId);
        yield call(updateTeacher, { teacher: { ...teacher, disable: !disableStatus } });
        yield put(deleteTeacher(teacherId, disableStatus));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* handleTeacher({ values }) {
    try {
        if (values.id) {
            yield call(updateTeacher, { teacher: values });
        } else {
            yield call(createTeacher, values);
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getTeachersWithoutAccount() {
    try {
        const { data } = yield call(axiosCall, TEACHERS_WITHOUT_ACCOUNT_URL, GET);

        yield put(getTeacherWithoutAccountSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export default function* watchTeachers() {
    yield takeLatest(actionTypes.DELETE_TEACHER_START, removeTeacher);
    yield takeLatest(actionTypes.SHOW_ALL_TEACHERS_START, showTeachers);
    yield takeLatest(actionTypes.SET_DISABLED_TEACHERS_START, getDisabledTeachers);
    yield takeLatest(actionTypes.GET_TEACHERS_WITHOUT_ACCOUNT_START, getTeachersWithoutAccount);
    yield takeLatest(actionTypes.ADD_TEACHER_START, createTeacher);
    yield takeLatest(actionTypes.UPDATE_TEACHER_START, updateTeacher);
    yield takeLatest(actionTypes.HANDLE_TEACHER_START, handleTeacher);
    yield takeLatest(actionTypes.TOOGLE_TEACHER_START, toggleDisabledTeacher);
}
