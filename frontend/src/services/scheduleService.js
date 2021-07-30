import { store } from '../index';
import React, { useEffect } from 'react';
import axios from '../helper/axios';
import i18n from '../helper/i18n';
import { errorHandler, successHandler } from '../helper/handlerAxios';

import {
    checkAvailabilitySchedule,
    deleteItemFromSchedule,
    setCurrentSemester,
    setDefaultSemester,
    setFullSchedule,
    setGroupSchedule,
    setItemGroupId,
    setScheduleGroupId,
    setScheduleItems,
    setScheduleSemesterId,
    setScheduleTeacherId,
    setScheduleType,
    setSemesterList,
    setTeacherSchedule,
    showAllGroups,
    showAllTeachers,
    setTeacherRangeSchedule,
    setTeacherViewType
} from '../redux/actions/index';

import {
    setLoadingService,
    setScheduleLoadingService,
    setSemesterLoadingService
} from './loadingService';
import { handleSnackbarOpenService } from './snackbarService';

import {
    CURRENT_SEMESTER_URL,
    DEFAULT_SEMESTER_URL,
    FULL_SCHEDULE_URL,
    GROUP_SCHEDULE_URL,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_SEMESTER_ITEMS_URL,
    PUBLIC_SEMESTERS_URL,
    TEACHER_SCHEDULE_URL,
    PUBLIC_GROUP_URL,
    PUBLIC_TEACHER_URL,
    FOR_TEACHER_SCHEDULE_URL,
    CLEAR_SCHEDULE_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_ITEM_ROOM_CHANGE, TEACHER_URL
} from '../constants/axios';

import { snackbarTypes } from '../constants/snackbarTypes';

import { showBusyRooms } from './busyRooms';
import { TEACHER_SCHEDULE_FORM } from '../constants/reduxForms';
import { resetFormHandler } from '../helper/formHelper';
import { useHistory } from 'react-router-dom';
import { getAllTeachersByDepartmentId } from '../redux/actions/teachers';

export const getCurrentSemesterService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then(response => {
            setSemesterLoadingService(false);
            store.dispatch(setCurrentSemester(response.data));
        })
        .catch(err => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                i18n.t('common:no_current_semester_error')
            );
            setSemesterLoadingService(false);
        });
};
export const getDefaultSemesterService = () => {

    const data={
        "semester": {
            "id": 18,
            "description": "20202-1",
            "year": 2021,
            "startDay": "04/06/2020",
            "endDay": "30/09/2020",
            "currentSemester": false,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
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
                    "id": 7,
                    "startTime": "14:40",
                    "endTime": "16:00",
                    "class_name": "5"
                },
                {
                    "id": 8,
                    "startTime": "16:10",
                    "endTime": "17:30",
                    "class_name": "6"
                }
            ]
        },
        "schedule": [
            {
                "group": {
                    "id": 5,
                    "title": "101-В",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 27,
                    "title": "102-А",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 29,
                    "title": "101-б",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 30,
                    "title": "101-А",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Програмування",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Програмування",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    //store.dispatch(setDefaultSemester(data));
    axios
        .get(DEFAULT_SEMESTER_URL)
        .then(response => {
            setSemesterLoadingService(false);
            store.dispatch(setDefaultSemester(response.data));
        })
        .catch(err => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                i18n.t('common:no_current_semester_error')
            );
            setSemesterLoadingService(false);
        });
};

export const disableDefaultSemesterService=()=>{
    store.dispatch(setDefaultSemester({}));
}

export const getScheduleItemsService = () => {
    axios
        .get(CURRENT_SEMESTER_URL)
        .then(response => {
            store.dispatch(setCurrentSemester(response.data));
            getScheduleItemsServiceBySemester(response.data.id);
            showBusyRooms(response.data.id);
        })
        .catch(err => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                i18n.t('common:no_current_semester_error')
            );
            setLoadingService(false);
        });
};

const getScheduleItemsServiceBySemester = semesterId => {
    axios
        .get(`${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`)
        .then(response => {
            store.dispatch(setScheduleItems(response.data));
            setScheduleLoadingService(false);
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const checkAvailabilityScheduleService = item => {
    axios
        .get(
            SCHEDULE_CHECK_AVAILABILITY_URL +
                '?classId=' +
                item.periodId +
                '&dayOfWeek=' +
                item.dayOfWeek +
                '&evenOdd=' +
                item.evenOdd +
                '&lessonId=' +
                item.lessonId +
                '&semesterId=' +
                item.semesterId
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(checkAvailabilitySchedule(response.data));
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
export const checkAvailabilityChangeRoomScheduleService = item => {
    axios
        .get(
            ROOMS_AVAILABILITY +
                '?classId=' +
                item.periodId +
                '&dayOfWeek=' +
                item.dayOfWeek +
                '&evenOdd=' +
                item.evenOdd +
                '&semesterId=' +
                item.semesterId
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(
                checkAvailabilitySchedule({
                    classSuitsToTeacher: true,
                    teacherAvailable: true,
                    rooms: response.data
                })
            );
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
export const addItemToScheduleService = item => {
    axios
        .post(SCHEDULE_ITEMS_URL, item)
        .then(response => {
            getScheduleItemsService();
        })
        .catch(err => errorHandler(err));
};
export const editRoomItemToScheduleService = item => {
    axios
        .put(
            SCHEDULE_ITEM_ROOM_CHANGE +
                '?roomId=' +
                item.roomId +
                '&scheduleId=' +
                item.itemId
        )
        .then(response => {
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('common:schedule_title'),
                    actionType: i18n.t('serviceMessages:updated_label')
                })
            );
            getScheduleItemsService();
        })
        .catch(err => errorHandler(err));
};
export const deleteItemFromScheduleService = itemId => {
    axios
        .delete(`${SCHEDULE_ITEMS_URL}/${itemId}`)
        .then(response => {
            store.dispatch(deleteItemFromSchedule(itemId));
            getScheduleItemsService();
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const submitSearchSchedule = values => {

    setScheduleSemesterIdService(values.semester);

    if (values.hasOwnProperty('group') && +values.group > 0) {
        setScheduleTypeService('group');
        setScheduleGroupIdService(values.group);
        getGroupSchedule(values.group, values.semester);

        return;
    }
    if (values.hasOwnProperty('teacher') && +values.teacher > 0) {
        setScheduleTypeService('teacher');
        // setScheduleGroupIdService(values.teacher);
        setScheduleTeacherIdService(values.teacher)
        getTeacherSchedule(values.teacher, values.semester);
        return;
    }
    if (
        (!values.hasOwnProperty('group') &&
            !values.hasOwnProperty('teacher')) ||
        (values.hasOwnProperty('group') &&
            !values.hasOwnProperty('teacher') &&
            +values.group === 0) ||
        (!values.hasOwnProperty('group') &&
            values.hasOwnProperty('teacher') &&
            +values.teacher === 0) ||
        (values.hasOwnProperty('group') &&
            values.hasOwnProperty('teacher') &&
            +values.teacher === 0 &&
            +values.group === 0)
    ) {
        setScheduleTypeService('full');
        getFullSchedule(values.semester);
        return;
    }
};


export const sendTeachersScheduleService = (data) => {
    //TODO remove hardcode data
    // let data = {
    //     teachersId: 'id',
    //     semesterId: ['abc', 123]
    // }
    const supQuery=new URLSearchParams(data).toString();
    console.log("sendTeachersScheduleService",supQuery)

    //axios
        // .get(`${SCHEDULE_ITEMS_URL}?${supQuery}`)
        // .then(response => {
        //     setLoadingService(false);
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('formElements:schedule_label'),
                    actionType: i18n.t('serviceMessages:sent_label')
                })
            );
        // })
        // .catch(error => errorHandler(error));
};

export const setItemGroupIdService = groupId => {
    store.dispatch(setItemGroupId(groupId));
};

export const setScheduleGroupIdService = groupId => {

    store.dispatch(setScheduleGroupId(groupId));
};

export const setScheduleTypeService = item => {
    store.dispatch(setScheduleType(item));
};

export const getFullSchedule = semesterId => {
    const data={
        "semester": {
            "id": 18,
            "description": "20202-1",
            "year": 2021,
            "startDay": "04/06/2020",
            "endDay": "30/09/2020",
            "currentSemester": false,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
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
                    "id": 7,
                    "startTime": "14:40",
                    "endTime": "16:00",
                    "class_name": "5"
                },
                {
                    "id": 8,
                    "startTime": "16:10",
                    "endTime": "17:30",
                    "class_name": "6"
                }
            ]
        },
        "schedule": [
            {
                "group": {
                    "id": 5,
                    "title": "101-В",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 27,
                    "title": "102-А",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 29,
                    "title": "101-б",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "group": {
                    "id": 30,
                    "title": "101-А",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Математичний аналіз",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "TUESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Програмування",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "THURSDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    },
                    {
                        "day": "FRIDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Програмування",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 7,
                                    "startTime": "14:40",
                                    "endTime": "16:00",
                                    "class_name": "5"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": null
                                },
                                "class": {
                                    "id": 8,
                                    "startTime": "16:10",
                                    "endTime": "17:30",
                                    "class_name": "6"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    store.dispatch(setFullSchedule(data));
    // axios
    //     .get(FULL_SCHEDULE_URL + semesterId)
    //     .then(response => {
    //         store.dispatch(setFullSchedule(response.data));
    //     })
    //     .catch(err => errorHandler(err));

};

export const getGroupSchedule = (groupId, semesterId) => {
    console.log("getGroupSchedule");
    const data={
        "semester": {
            "id": 10,
            "description": "20202-1",
            "year": 2021,
            "startDay": "04/06/2020",
            "endDay": "30/09/2020",
            "currentSemester": false,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
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
                    "id": 7,
                    "startTime": "14:40",
                    "endTime": "16:00",
                    "class_name": "5"
                },
                {
                    "id": 8,
                    "startTime": "16:10",
                    "endTime": "17:30",
                    "class_name": "6"
                }
            ]
        },
        "schedule": [
            {
                "group": {
                    "id": 29,
                    "title": "101-б",
                    "disable": false
                },
                "days": [
                    {
                        "day": "MONDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacherId": 42,
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Дискретна математика",
                                        "lessonType": "LECTURE",
                                        "room": {
                                            "id": 51,
                                            "name": "1 к.  11 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 1,
                                    "startTime": "08:20",
                                    "endTime": "09:40",
                                    "class_name": "1"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 2,
                                    "startTime": "09:50",
                                    "endTime": "11:10",
                                    "class_name": "2"
                                }
                            },
                            {
                                "weeks": {
                                    "even": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            },
                            {
                                "weeks": {
                                    "even": null,
                                    "odd": {
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    }
                                },
                                "class": {
                                    "id": 4,
                                    "startTime": "13:00",
                                    "endTime": "14:20",
                                    "class_name": "4"
                                }
                            }
                        ]
                    },
                    {
                        "day": "WEDNESDAY",
                        "classes": [
                            {
                                "weeks": {
                                    "even": {
                                        "teacherId": 19,
                                        "teacher": {
                                            "name":"Ігор",
                                            "surname":"Скутар",
                                            "patronymic":"Дмитрович",
                                            "position":"Доктор наук",
                                            "disable":"false"
                                        },
                                        "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                        "subjectForSite": "Computer Science",
                                        "lessonType": "LABORATORY",
                                        "room": {
                                            "id": 54,
                                            "name": "1 к. 3 ауд."
                                        },
                                        "temporary_schedule": null
                                    },
                                    "odd": null
                                },
                                "class": {
                                    "id": 3,
                                    "startTime": "11:30",
                                    "endTime": "12:50",
                                    "class_name": "3"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    store.dispatch(setGroupSchedule(data));
    // if (groupId > 0) {
    //     axios
    //         .get(GROUP_SCHEDULE_URL + semesterId + '&groupId=' + groupId)
    //         .then(response => {
    //             console.log(response.data)
    //             store.dispatch(setGroupSchedule(response.data));
    //         })
    //         .catch(err => errorHandler(err));
    // }
};
export const getTeacherSchedule = (teacherId, semesterId) => {
    const data={
        "semester": {
            "id": 10,
            "description": "20202-1",
            "year": 2021,
            "startDay": "04/06/2020",
            "endDay": "30/09/2020",
            "currentSemester": false,
            "disable": false,
            "semester_days": [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY"
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
                    "id": 7,
                    "startTime": "14:40",
                    "endTime": "16:00",
                    "class_name": "5"
                },
                {
                    "id": 8,
                    "startTime": "16:10",
                    "endTime": "17:30",
                    "class_name": "6"
                }
            ]
        },
        "teacher": {
            "id": 19,
            "name": "Ігор",
            "surname": "Скутар",
            "patronymic": "Дмитрович",
            "position": "асистент",
            "disable": false
        },
        "days": [
            {
                "day": "MONDAY",
                "even": {
                    "classes": [
                        {
                            "lessons": [
                                {
                                    "id": 518,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&teacher=19",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 29,
                                        "title": "101-б",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                }
                            ],
                            "class": {
                                "id": 3,
                                "startTime": "11:30",
                                "endTime": "12:50",
                                "class_name": "3"
                            }
                        }
                    ]
                },
                "odd": {
                    "classes": [
                        {
                            "lessons": [
                                {
                                    "id": 518,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 29,
                                        "title": "101-б",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                },
                                {
                                    "id": 519,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 30,
                                        "title": "101-А",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                }
                            ],
                            "class": {
                                "id": 2,
                                "startTime": "09:50",
                                "endTime": "11:10",
                                "class_name": "2"
                            }
                        },
                        {
                            "lessons": [
                                {
                                    "id": 518,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&teacher=19",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 29,
                                        "title": "101-б",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                },
                                {
                                    "id": 519,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 30,
                                        "title": "101-А",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                },
                                {
                                    "id": 521,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 5,
                                        "title": "101-В",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                },
                                {
                                    "id": 522,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 27,
                                        "title": "102-А",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                }
                            ],
                            "class": {
                                "id": 3,
                                "startTime": "11:30",
                                "endTime": "12:50",
                                "class_name": "3"
                            }
                        },
                        {
                            "lessons": [
                                {
                                    "id": 518,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 29,
                                        "title": "101-б",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                }
                            ],
                            "class": {
                                "id": 4,
                                "startTime": "13:00",
                                "endTime": "14:20",
                                "class_name": "4"
                            }
                        }
                    ]
                }
            },
            {
                "day": "WEDNESDAY",
                "even": {
                    "classes": [
                        {
                            "lessons": [
                                {
                                    "id": 518,
                                    "teacher": {
                                        "name":"Ігор",
                                        "surname":"Скутар",
                                        "patronymic":"Дмитрович",
                                        "position":"Доктор наук",
                                        "disable":"false"
                                    },
                                    "linkToMeeting":"http://localhost:3000/schedule?semester=10&group=27",
                                    "subjectForSite": "Computer Science",
                                    "lessonType": "LABORATORY",
                                    "group": {
                                        "id": 29,
                                        "title": "101-б",
                                        "disable": false
                                    },
                                    "room": "1 к. 3 ауд.",
                                    "temporary_schedule": null
                                }
                            ],
                            "class": {
                                "id": 3,
                                "startTime": "11:30",
                                "endTime": "12:50",
                                "class_name": "3"
                            }
                        }
                    ]
                },
                "odd": {
                    "classes": []
                }
            }
        ]
    };
    store.dispatch(setTeacherSchedule(data));
    // if (teacherId > 0) {
    //     axios
    //         .get(TEACHER_SCHEDULE_URL + semesterId + '&teacherId=' + teacherId)
    //         .then(response => {
    //             store.dispatch(setTeacherSchedule(response.data));
    //         })
    //         .catch(err => errorHandler(err));
    // }
};
export const setScheduleTeacherIdService = teacherId => {
    store.dispatch(setScheduleTeacherId(teacherId));
};

export const showAllPublicSemestersService = () => {
    axios
        .get(PUBLIC_SEMESTERS_URL)
        .then(response => {
            store.dispatch(setSemesterList(response.data));
        })
        .catch(err => errorHandler(err));
};
export const setScheduleSemesterIdService = semesterId => {
    store.dispatch(setScheduleSemesterId(semesterId));
};

export const showAllPublicGroupsService = () => {
    axios
        .get(PUBLIC_GROUP_URL)
        .then(response => {
            store.dispatch(showAllGroups(response.data.sort((a, b) => a - b)));
        })
        .catch(err => errorHandler(err));
};

export const showAllPublicTeachersService = () => {
    axios
        .get(PUBLIC_TEACHER_URL)
        .then(response => {
            store.dispatch(showAllTeachers(response.data));
        })
        .catch(err => errorHandler(err));
};
export const showAllPublicTeachersByDepartmentService = (departmentId) => {
    const data=[
        {
            "department":{
                "id": 41,
                "name": "mat analysi",
                "disable": false
            },
            "id": 49,
            "name": "Світлана",
            "surname": "Боднарук",
            "patronymic": "Богданівна",
            "position": "доцент",
            "disable": false,
            "email":"nasta_2000@i.ua"
        },
        {
            "department":{
                "id": 44,
                "name": "Computer Science1",
                "disable": false
            },
            "id": 39,
            "name": "Ірина",
            "surname": "Вернигора",
            "patronymic": "Володимирівна",
            "position": "доцент",
            "disable": false,
            "email":"nasta_2000@i.ua"
        }
    ];
    store.dispatch(getAllTeachersByDepartmentId(data));
    // axios
    //     .get(`${PUBLIC_TEACHER_URL}/departmentId=${departmentId}`)
    //     .then(response => {
    //         store.dispatch(getAllTeachersByDepartmentId(response.data));
    //     })
    //     .catch(err => errorHandler(err));
};

export const clearTeacherScheduleFormService = () => {
    resetFormHandler(TEACHER_SCHEDULE_FORM);
};

export const getTeacherScheduleService = values => {
    axios
        .get(
            FOR_TEACHER_SCHEDULE_URL +
                '?from=' +
                values.startDay.replace(/\//g, '-') +
                '&to=' +
                values.endDay.replace(/\//g, '-')
        )
        .then(response => {
            setLoadingService(false);
            store.dispatch(setTeacherRangeSchedule(response.data));
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};

export const getTeacherScheduleByDateRangeService = (teacherId, to, from) => {
    axios
        .get(
            FOR_TEACHER_SCHEDULE_URL +
                '?teacherId' +
                teacherId +
                '&from=' +
                from.replace(/\//g, '-') +
                '&to=' +
                to.replace(/\//g, '-')
        )
        .then(response => {})
        .catch(err => {
            errorHandler(err);
        });
};

export const setTeacherServiceViewType = type => {
    store.dispatch(setTeacherViewType(type));
};

export const clearSchedule = semesterId => {
    axios
        .delete(CLEAR_SCHEDULE_URL + '?semesterId=' + semesterId)
        .then(response => {
            getScheduleItemsService();
            successHandler(
                i18n.t('serviceMessages:back_end_success_operation', {
                    cardType: i18n.t('common:schedule_title'),
                    actionType: i18n.t('serviceMessages:cleared_label')
                })
            );
        })
        .catch(err => {
            errorHandler(err);
            setLoadingService(false);
        });
};
