import { call, put } from 'redux-saga/effects';
import { setLoading, setOpenSnackbar, setTeacherSchedule } from '../../actions';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { axiosCall } from '../../services/axios';
import i18n from '../../i18n';
import { TEACHER_SCHEDULE_URL } from '../../constants/axios';
import { makeTeacherSchedule } from '../../mappers/teacherScheduleMapper';

export function* getTeacherSchedule({ teacherId, semesterId }) {
    const requestUrl = `${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`;
    try {
        const response = yield call(axiosCall, requestUrl);
        const mappedSchedule = yield call(makeTeacherSchedule, response.data);
        yield put(setTeacherSchedule(mappedSchedule));
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
