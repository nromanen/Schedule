import axios from '../helper/axios';
import {DEPARTMENT_URL} from '../constants/axios';
import {store} from '../store';
import {errorHandler} from '../helper/handlerAxios';
import {
    clearDepartmentForm,
    getAllDepartments,
    getDepartItemById,
} from '../actions/departments';

export const getAllDepartmentsService = () => {
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
