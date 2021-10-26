import { get } from 'lodash';
import i18n from '../i18n';
import { store } from '../store';

import axios from '../helper/axios';
import {
    DISABLED_SEMESTERS_URL,
    SEMESTERS_URL,
    SEMESTER_COPY_URL,
    LESSONS_FROM_SEMESTER_COPY_URL,
    CREATE_ARCHIVE_SEMESTER,
    ARCHIVED_SEMESTERS_URL,
    DEFAULT_SEMESTER_URL,
} from '../constants/axios';
import { setDisabledSemesters, setError } from '../actions/semesters';
import { SEMESTER_FORM } from '../constants/reduxForms';
import { snackbarTypes } from '../constants/snackbarTypes';
import { handleSnackbarOpenService } from './snackbarService';
import { checkUniqSemester } from '../validation/storeValidation';
import {
    addSemester,
    clearSemester,
    deleteSemester,
    selectSemester,
    showAllSemesters,
    updateSemester,
    setArchivedSemesters,
    moveToArchivedSemester,
    setScheduleType,
    setFullSchedule,
} from '../actions/index';

import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';
import {
    BACK_END_SUCCESS_OPERATION,
    UPDATED_LABEL,
    CREATED_LABEL,
    DELETED_LABEL,
    SEMESTER_SERVICE_IS_ACTIVE,
    SEMESTER_SERVICE_NOT_AS_BEGIN_OR_END,
    COPIED_LABEL,
    ARCHIVED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import {
    FORM_LESSON_LABEL,
    FORM_SEMESTER_LABEL,
} from '../constants/translationLabels/formElements';
import { COMMON_SEMESTER_IS_NOT_UNIQUE } from '../constants/translationLabels/common';

export const selectSemesterService = (semesterId) => store.dispatch(selectSemester(semesterId));

export const setUniqueErrorService = (isUniqueError) => store.dispatch(setError(isUniqueError));

export const clearSemesterService = () => {
    store.dispatch(clearSemester());
    resetFormHandler(SEMESTER_FORM);
};

export const showAllSemestersService = () => {
    axios
        .get(SEMESTERS_URL)
        .then((response) => {
            store.dispatch(
                showAllSemesters(
                    response.data.sort((a, b) => (a.year > b.year ? 1 : -1)).reverse(),
                ),
            );
        })
        .catch((error) => errorHandler(error));
};

export const getDisabledSemestersService = () => {
    axios
        .get(DISABLED_SEMESTERS_URL)
        .then((res) => {
            store.dispatch(setDisabledSemesters(res.data));
        })
        .catch((err) => errorHandler(err));
};

export const getArchivedSemestersService = () => {
    axios
        .get(ARCHIVED_SEMESTERS_URL)
        .then((response) => {
            store.dispatch(setArchivedSemesters(response.data));
        })
        .catch((err) => errorHandler(err));
};
//need to refactor
const setSemester = (resp) => {
    store.dispatch(updateSemester(resp));
    selectSemesterService(null);
    getDisabledSemestersService();
    // getArchivedSemestersService();
    showAllSemestersService();
    resetFormHandler(SEMESTER_FORM);
    successHandler(
        i18n.t(BACK_END_SUCCESS_OPERATION, {
            cardType: i18n.t(FORM_SEMESTER_LABEL),
            actionType: i18n.t(UPDATED_LABEL),
        }),
    );
};

export const setGroupsToSemester = (semesterId, groups) => {
    const groupIds = groups.map((item) => `groupId=${item.id}`).join('&');
    axios
        .put(`${SEMESTERS_URL}/${semesterId}/groups?${groupIds}`)
        .then((response) => {
            setSemester(response.data);
        })
        .catch((error) => errorHandler(error));
};
// TODO need to refactor
const cardSemester = (semester) => {
    const semesterDays = [];
    const semesterClasses = [];
    Object.keys(semester).forEach((prop) => {
        if (get(semester, prop)) {
            if (prop.indexOf('semester_days_markup_') >= 0 && semester[prop] === true) {
                semesterDays.push(prop.substring(21));
            }
        }
        if (get(semester, prop)) {
            if (prop.indexOf('semester_classes_markup_') >= 0 && semester[prop] === true) {
                semesterClasses.push(
                    store
                        .getState()
                        .classActions.classScheduler.find(
                            (schedule) => schedule.id === +prop.substring(24),
                        ),
                );
            }
        }
    });

    return {
        id: semester.id,
        year: +semester.year,
        description: semester.description,
        startDay: semester.startDay,
        endDay: semester.endDay,
        currentSemester: semester.currentSemester,
        defaultSemester: semester.defaultSemester,
        semester_days: semesterDays,
        semester_classes: semesterClasses,
        semester_groups: semester.semester_groups,
    };
};

export const removeSemesterCardService = (semesterId) => {
    const semester = store.getState().semesters.semesters.find((item) => item.id === semesterId);
    if (semester.currentSemester === true) {
        handleSnackbarOpenService(true, snackbarTypes.ERROR, i18n.t(SEMESTER_SERVICE_IS_ACTIVE));
        return;
    }
    axios
        .delete(`${SEMESTERS_URL}/${semesterId}`)
        .then(() => {
            store.dispatch(deleteSemester(semesterId));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(DELETED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

const putSemester = (data) => {
    axios
        .put(SEMESTERS_URL, data)
        .then((response) => {
            setSemester(response.data);
        })
        .catch((error) => errorHandler(error));
};

const postSemester = (data) => {
    axios
        .post(SEMESTERS_URL, data)
        .then((response) => {
            store.dispatch(addSemester(response.data));
            resetFormHandler(SEMESTER_FORM);
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(CREATED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};
const switchSaveActions = (semester) => {
    if (semester.id) {
        putSemester(semester);
    } else {
        postSemester(semester);
    }
};

const checkSemesterYears = (endDay, startDay, year) => {
    const dateEndYear = endDay.substring(endDay.length - 4);
    const dateStartYear = startDay.substring(startDay.length - 4);
    let conf = true;
    if (year !== +dateEndYear || year !== +dateStartYear) {
        conf = window.confirm(i18n.t(SEMESTER_SERVICE_NOT_AS_BEGIN_OR_END));
    }
    return conf;
};

const findCurrentSemester = (semesterId) => {
    return store
        .getState()
        .semesters.semesters.find(
            (semesterItem) =>
                semesterItem.currentSemester === true && semesterItem.id !== semesterId,
        );
};

export const handleSemesterService = (values) => {
    const semester = cardSemester(values);
    if (!checkUniqSemester(semester)) {
        handleSnackbarOpenService(true, snackbarTypes.ERROR, i18n.t(COMMON_SEMESTER_IS_NOT_UNIQUE));
        setUniqueErrorService(true);
        return;
    }
    if (!checkSemesterYears(semester.endDay, semester.startDay, semester.year)) return;

    if (semester.currentSemester) {
        const currentScheduleOld = findCurrentSemester(semester.id);
        if (currentScheduleOld) {
            currentScheduleOld.currentSemester = false;
            axios
                .put(SEMESTERS_URL, currentScheduleOld)
                .then((response) => {
                    store.dispatch(updateSemester(response.data));
                    switchSaveActions(semester);
                })
                .catch((error) => errorHandler(error));
        } else {
            switchSaveActions(semester);
        }
    } else {
        switchSaveActions(semester);
    }
};

export const setDefaultSemesterById = (dataId) => {
    axios
        .put(`${DEFAULT_SEMESTER_URL}?semesterId=${dataId}`)
        .then((response) => {
            setSemester(response.data);
        })
        .catch((error) => errorHandler(error));
};

export const setDisabledSemestersService = (semester) => {
    const bufferSemester = semester;
    bufferSemester.disable = true;
    putSemester(bufferSemester);
};

export const setEnabledSemestersService = (semester) => {
    const bufferSemester = semester;
    bufferSemester.disable = false;
    putSemester(bufferSemester);
};

export const semesterCopy = (values) => {
    axios
        .post(
            `${SEMESTER_COPY_URL}?fromSemesterId=${values.fromSemesterId}&toSemesterId=${values.toSemesterId}`,
        )
        .then(() => {
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(COPIED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const CopyLessonsFromSemesterService = (values) => {
    axios
        .post(
            `${LESSONS_FROM_SEMESTER_COPY_URL}?fromSemesterId=${values.fromSemesterId}&toSemesterId=${values.toSemesterId}`,
        )
        .then(() => {
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_LESSON_LABEL),
                    actionType: i18n.t(COPIED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const createArchiveSemesterService = (semesterId) => {
    axios
        .post(`${CREATE_ARCHIVE_SEMESTER}/${semesterId}`)
        .then(() => {
            store.dispatch(moveToArchivedSemester(semesterId));
            successHandler(
                i18n.t(BACK_END_SUCCESS_OPERATION, {
                    cardType: i18n.t(FORM_SEMESTER_LABEL),
                    actionType: i18n.t(ARCHIVED_LABEL),
                }),
            );
        })
        .catch((error) => errorHandler(error));
};

export const viewArchivedSemester = (semesterId) => {
    setScheduleType('archived');
    axios
        .get(`${CREATE_ARCHIVE_SEMESTER}/${semesterId}`)
        .then((response) => {
            store.dispatch(setFullSchedule(response.data));
        })
        .catch((err) => errorHandler(err));
};
