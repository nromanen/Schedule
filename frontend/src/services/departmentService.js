import axios from '../helper/axios';
import {DEPARTMENT_URL} from '../constants/axios';
import {store} from '../store';
import {errorHandler} from '../helper/handlerAxios';
import {
    clearDepartmentForm,
    getAllDepartments,
    getDepartItemById,
} from '../actions/departments';
import {isEmpty} from "lodash";

export const getAllDepartmentsService = () => {
    const departments = store.getState().departments.departments;
    if (!isEmpty(departments)) return;

    axios
        .get(DEPARTMENT_URL)
        .then((response) => {
            store.dispatch(getAllDepartments(response.data));
        })
        .catch((error) => errorHandler(error));
};

export const clearDepartment = () => {
    store.dispatch(clearDepartmentForm());
};

export const getDepartmentByIdService = (id) => {
    store.dispatch(getDepartItemById(Number(id)));
};
