import i18n from '../helper/i18n';
import { store } from '../index';
import axios from '../helper/axios';
import {
    DISABLED_SEMESTERS_URL,
    SEMESTERS_URL,
    SEMESTER_COPY_URL,
    LESSONS_FROM_SEMESTER_COPY_URL,
    CREATE_ARCHIVE_SEMESTER,
    ARCHIVED_SEMESTERS_URL, DEFAULT_SEMESTER_URL
} from '../constants/axios';
import { setDisabledSemesters, setError } from '../redux/actions/semesters';
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
    setFullSchedule
} from '../redux/actions/index';

import { errorHandler, successHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';

export const selectSemesterService = semesterId =>
    store.dispatch(selectSemester(semesterId));

export const setUniqueErrorService = isUniqueError =>
    store.dispatch(setError(isUniqueError));

export const clearSemesterService = () => {
    store.dispatch(clearSemester());
    resetFormHandler(SEMESTER_FORM);
};

export const showAllSemestersService = () => {
    const data=[
        {
            "id": 3,
            "description": "Перший семестр стаціонар 2020/2021",
            "year": 2020,
            "startDay": "01/09/2020",
            "endDay": "24/12/2020",
            "currentSemester": false,
            "defaultSemester": false,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
            ],
            "semester_groups":[
                {
                    "id": 30,
                    "title": "101-Аh"
                },
                {
                    "id": 29,
                    "title": "101-б"
                },
                {
                    "id": 5,
                    "title": "101-В"
                },
                {
                    "id": 6,
                    "title": "102"
                },
                {
                    "id": 27,
                    "title": "102-А"
                }
            ],
            "semester_classes": [
                {
                    "id": 1,
                    "startTime": "08:20",
                    "endTime": "09:40",
                    "class_name": "1"
                },
                {
                    "id": 2,
                    "startTime": "09:50",
                    "endTime": "11:10",
                    "class_name": "2"
                },
                {
                    "id": 3,
                    "startTime": "11:30",
                    "endTime": "12:50",
                    "class_name": "3"
                },
                {
                    "id": 4,
                    "startTime": "13:00",
                    "endTime": "14:20",
                    "class_name": "4"
                }
            ]
        },
        {
            "id": 5,
            "description": "2021-2022",
            "year": 2022,
            "startDay": "13/06/2021",
            "endDay": "31/07/2021",
            "currentSemester": false,
            "defaultSemester": true,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY"
            ],
            "semester_groups":[
                {
                    "id": 26,
                    "title": "102-Б"
                },
                {
                    "id": 28,
                    "title": "105"
                },
                {
                    "id": 33,
                    "title": "108"
                },
                {
                    "id": 1,
                    "title": "317а"
                },
                {
                    "id": 38,
                    "title": "kkkk"
                },
                {
                    "id": 39,
                    "title": "New"
                },
                {
                    "id": 37,
                    "title": "new issue b"
                },
                {
                    "id": 40,
                    "title": "NewTest"
                }
            ],
            "semester_classes": [
                {
                    "id": 1,
                    "startTime": "08:20",
                    "endTime": "09:40",
                    "class_name": "1"
                },
                {
                    "id": 2,
                    "startTime": "09:50",
                    "endTime": "11:10",
                    "class_name": "2"
                },
                {
                    "id": 3,
                    "startTime": "11:30",
                    "endTime": "12:50",
                    "class_name": "3"
                },
                {
                    "id": 4,
                    "startTime": "13:00",
                    "endTime": "14:20",
                    "class_name": "4"
                },
                {
                    "id": 8,
                    "startTime": "16:10",
                    "endTime": "17:30",
                    "class_name": "6"
                }
            ]
        }
    ];
    store.dispatch(
                showAllSemesters(
                   data
                        .sort((a, b) => (a.year > b.year ? 1 : -1))
                        .reverse()
                )
            );
    // axios
    //     .get(SEMESTERS_URL)
    //     .then(response => {
    //         store.dispatch(
    //             showAllSemesters(
    //                 response.data
    //                     .sort((a, b) => (a.year > b.year ? 1 : -1))
    //                     .reverse()
    //             )
    //         );
    //     })
    //     .catch(error => errorHandler(error));

};

const cardSemester = semester => {
    const semester_days = [];
    const semester_classes = [];
    for (let prop in semester) {
        if (Object.prototype.hasOwnProperty.call(semester, prop)) {
            if (
                prop.indexOf('semester_days_markup_') >= 0 &&
                semester[prop] === true
            ) {
                semester_days.push(prop.substring(21));
            }
        }
        if (Object.prototype.hasOwnProperty.call(semester, prop)) {
            if (
                prop.indexOf('semester_classes_markup_') >= 0 &&
                semester[prop] === true
            ) {
                semester_classes.push(
                    store
                        .getState()
                        .classActions.classScheduler.find(
                            schedule => schedule.id === +prop.substring(24)
                        )
                );
            }
        }
    }

    return {
        id: semester.id,
        year: +semester.year,
        description: semester.description,
        startDay: semester.startDay,
        endDay: semester.endDay,
        currentSemester: semester.currentSemester,
        defaultSemester: semester.defaultSemester,
        semester_days: semester_days,
        semester_classes: semester_classes,

    };
};

export const removeSemesterCardService = semesterId => {
    const semester = store
        .getState()
        .semesters.semesters.find(item => item.id === semesterId);
    if (semester.currentSemester === true) {
        handleSnackbarOpenService(
            true,
            snackbarTypes.ERROR,
            i18n.t('serviceMessages:semester_service_is_active')
        );
        return;
    }
    axios
        .delete(SEMESTERS_URL + `/${semesterId}`)
        .then(response => {
            store.dispatch(deleteSemester(semesterId));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:semester_label'),
                    actionType: i18n.t('serviceMessages:deleted_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};

const switchSaveActions = semester => {
    if (semester.id) {
        putSemester(semester);
    } else {
        postSemester(semester);
    }
};

export const handleSemesterService = values => {

    let semester = cardSemester(values);
    if (!checkUniqSemester(semester)) {
        handleSnackbarOpenService(
            true,
            snackbarTypes.ERROR,
            i18n.t('common:semester_service_is_not_unique')
        );
        setUniqueErrorService(true);
        return;
    }
    if (!checkSemesterYears(semester.endDay, semester.startDay, semester.year))
        return;

    if (semester.currentSemester) {
        const currentScheduleOld = findCurrentSemester(semester.id);
        if (currentScheduleOld) {
            currentScheduleOld.currentSemester = false;
            axios
                .put(SEMESTERS_URL, currentScheduleOld)
                .then(response => {
                    store.dispatch(updateSemester(response.data));
                    switchSaveActions(semester);
                })
                .catch(error => errorHandler(error));
        } else {
            switchSaveActions(semester);
        }
    } else {
        switchSaveActions(semester);
    }
};

const checkSemesterYears = (endDay, startDay, year) => {
    const dateEndYear = +endDay.substring(endDay.length - 4);
    const dateStartYear = +startDay.substring(startDay.length - 4);
    let conf = true;
    if (year !== dateEndYear || year !== dateStartYear) {
        conf = window.confirm(
            i18n.t('serviceMessages:semester_service_not_as_begin_or_end')
        );
    }
    return conf;
};
export const setDefaultSemesterById = dataId => {
     axios
    .put(`${DEFAULT_SEMESTER_URL}?semesterId=${dataId}`)
        .then(response => {
           store.dispatch(updateSemester(response.data));
            selectSemesterService(null);
             getDisabledSemestersService();
            getArchivedSemestersService();
             showAllSemestersService();
             resetFormHandler(SEMESTER_FORM);
             successHandler(
                 i18n.t('serviceMessages:back_end_success_operation', {
                     cardType: i18n.t('formElements:semester_label'),
                     actionType: i18n.t('serviceMessages:updated_label')
                 })
             );
         })
        .catch(error => errorHandler(error));
}

const putSemester = data => {
     axios
    .put(SEMESTERS_URL, data)
        .then(response => {
           store.dispatch(updateSemester(response.data));
            selectSemesterService(null);
             getDisabledSemestersService();
            getArchivedSemestersService();
             showAllSemestersService();
             resetFormHandler(SEMESTER_FORM);
             successHandler(
                 i18n.t('serviceMessages:back_end_success_operation', {
                     cardType: i18n.t('formElements:semester_label'),
                     actionType: i18n.t('serviceMessages:updated_label')
                 })
             );
         })
        .catch(error => errorHandler(error));
};
const postSemester = data => {
    axios
        .post(SEMESTERS_URL, data)
        .then(response => {
            store.dispatch(addSemester(response.data));
            resetFormHandler(SEMESTER_FORM);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:semester_label'),
                    actionType: i18n.t('serviceMessages:created_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};
const findCurrentSemester = semesterId => {
    return store
        .getState()
        .semesters.semesters.find(
            semesterItem =>
                semesterItem.currentSemester === true &&
                semesterItem.id !== semesterId
        );
};
const findDefaultSemester = semesterId => {
    return store
        .getState()
        .semesters.semesters.find(
            semesterItem =>
                semesterItem.defaultSemester === true &&
                semesterItem.id !== semesterId
        );
};
export const getDisabledSemestersService = () => {
    axios
        .get(DISABLED_SEMESTERS_URL)
        .then(res => {
            store.dispatch(setDisabledSemesters(res.data));
        })
        .catch(err => errorHandler(err));
};

export const setDisabledSemestersService = semester => {
    semester.disable = true;
    putSemester(semester);
};

export const setEnabledSemestersService = semester => {
    semester.disable = false;
    putSemester(semester);
};

export const semesterCopy = values => {
    axios
        .post(
            SEMESTER_COPY_URL +
                '?fromSemesterId=' +
                values.fromSemesterId +
                '&toSemesterId=' +
                values.toSemesterId
        )
        .then(response => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:semester_label'),
                    actionType: i18n.t('serviceMessages:copied_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};

export const CopyLessonsFromSemesterService = values => {
    axios
        .post(
            LESSONS_FROM_SEMESTER_COPY_URL +
                '?fromSemesterId=' +
                values.fromSemesterId +
                '&toSemesterId=' +
                values.toSemesterId
        )
        .then(response => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:lesson_label'),
                    actionType: i18n.t('serviceMessages:copied_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};

export const createArchiveSemesterService = semesterId => {
    axios
        .post(CREATE_ARCHIVE_SEMESTER + '/' + semesterId)
        .then(response => {
            store.dispatch(moveToArchivedSemester(semesterId));
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:semester_label'),
                    actionType: i18n.t('serviceMessages:archived_label')
                })
            );
        })
        .catch(error => errorHandler(error));
};

export const getArchivedSemestersService = () => {
    axios
        .get(ARCHIVED_SEMESTERS_URL)
        .then(response => {
            store.dispatch(setArchivedSemesters(response.data));
        })
        .catch(err => errorHandler(err));
};

export const viewArchivedSemester = semesterId => {
    setScheduleType('archived');
    axios
        .get(CREATE_ARCHIVE_SEMESTER + '/' + semesterId)
        .then(response => {
            store.dispatch(setFullSchedule(response.data));
        })
        .catch(err => errorHandler(err));
};
