import * as actionTypes from './actionsType';

export const showAllSemesters = res => {
    console.log("showAllSemesters",res)
    const data=[{"id":7,"description":"Семестер для архівування","year":2020,"startDay":"19/05/2020","endDay":"30/05/2020","defaultSemester":false,"currentSemester":false,"disable":false,
        "semester_days":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],"semester_classes":[{"id":1,"startTime":"08:20","endTime":"09:40","class_name":"1"},
            {"id":2,"startTime":"09:50","endTime":"11:10","class_name":"2"},
            {"id":3,"startTime":"11:30","endTime":"12:50","class_name":"3"},
            {"id":4,"startTime":"13:00","endTime":"14:20","class_name":"4"}]},

        {"id":6,"description":"Весняна сесія заочники1","year":2021,"startDay":"13/06/2020","endDay":"31/07/2020","defaultSemester":true,"currentSemester":false,"disable":false,
            "semester_days":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],"semester_classes":[{"id":1,"startTime":"08:20","endTime":"09:40","class_name":"1"},
                {"id":2,"startTime":"09:50","endTime":"11:10","class_name":"2"},{"id":3,"startTime":"11:30","endTime":"12:50","class_name":"3"},
                {"id":4,"startTime":"13:00","endTime":"14:20","class_name":"4"}]},
        {"id":5,"description":"2021-2022","year":2022,"startDay":"13/06/2021","endDay":"31/07/2021","defaultSemester":false,"currentSemester":true,"disable":false,
            "semester_days":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],"semester_classes":[{"id":1,"startTime":"08:20","endTime":"09:40","class_name":"1"},
                {"id":2,"startTime":"09:50","endTime":"11:10","class_name":"2"},{"id":3,"startTime":"11:30","endTime":"12:50","class_name":"3"},
                {"id":4,"startTime":"13:00","endTime":"14:20","class_name":"4"}]}
    ]
    return {
        type: actionTypes.SHOW_ALL_SEMESTERS,
        // result: res
        result:data
    };
};

export const setDisabledSemesters = res => {
    return {
        type: actionTypes.SET_DISABLED_SEMESTERS,
        result: res
    };
};
export const setArchivedSemesters = res => {
    return {
        type: actionTypes.SET_ARCHIVED_SEMESTERS,
        result: res
    };
};

export const addSemester = res => {
    return {
        type: actionTypes.ADD_SEMESTER,
        result: res
    };
};

export const deleteSemester = res => {
    return {
        type: actionTypes.DELETE_SEMESTER,
        result: res
    };
};

export const selectSemester = res => {

    return {
        type: actionTypes.SELECT_SEMESTER,
        result: res
    };
};

export const updateSemester = res => {
    return {
        type: actionTypes.UPDATE_SEMESTER,
        result: res
    };
};

export const moveToArchivedSemester = res => {
    return {
        type: actionTypes.MOVE_SEMESTER_TO_ARCHIVE,
        result: res
    };
};

export const clearSemester = () => ({
    type: actionTypes.CLEAR_SEMESTER
});

export const setError = res => {
    return {
        type: actionTypes.SET_ERROR,
        result: res
    };
};
