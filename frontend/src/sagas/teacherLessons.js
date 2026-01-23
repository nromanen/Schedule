import {call, put, select, takeLatest} from 'redux-saga/effects';
import {axiosCall} from '../services/axios';
import {GET, PUT} from '../constants/methods';
import {LESSON_URL} from '../constants/axios';
import {BACK_END_SUCCESS_OPERATION, UPDATED_LABEL,} from '../constants/translationLabels/serviceMessages';
import {FORM_LESSON_LABEL} from '../constants/translationLabels/formElements';
import {createErrorMessage, createMessage} from '../utils/sagaUtils';
import {setOpenErrorSnackbar, setOpenSuccessSnackbar} from '../actions/snackbar';
import * as actionTypes from '../actions/actionsType';
import {
    getLessonsByTeacherSuccess,
    setTeacherLessonsLoading,
    updateLessonsLinkSuccess,
} from '../actions/teacherLessons';

export function* getLessonsByTeacher({ teacherId }) {
    try {
        yield put(setTeacherLessonsLoading(true));

        const state = yield select();
        const teacher = state.teachers.teachers.find((t) => t.id === teacherId);

        const requestUrl = `${LESSON_URL}/teacher?teacherId=${teacherId}`;
        const { data } = yield call(axiosCall, requestUrl, GET);

        yield put(getLessonsByTeacherSuccess(data, teacher));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
        yield put(setTeacherLessonsLoading(false));
    }
}

export function* updateLessonsLink({ linkData }) {
    try {
        const requestUrl = `${LESSON_URL}/link`;
        yield call(axiosCall, requestUrl, PUT, linkData);

        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_LESSON_LABEL || 'Посилання',
            UPDATED_LABEL,
        );

        const state = yield select();
        const teacherId = state.teacherLessons.selectedTeacher?.id;
        if (teacherId) {
            const lessonsUrl = `${LESSON_URL}/teacher?teacherId=${teacherId}`;
            const { data } = yield call(axiosCall, lessonsUrl, GET);
            yield put(updateLessonsLinkSuccess(data));
        }

        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export default function* watchTeacherLessons() {
    yield takeLatest(actionTypes.GET_LESSONS_BY_TEACHER_START, getLessonsByTeacher);
    yield takeLatest(actionTypes.UPDATE_LESSONS_LINK_START, updateLessonsLink);
}