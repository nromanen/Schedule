import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    departments: [],
    department: {},
    disabledDepartments: []
};

const departments = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_DEPARTMENT:
            return updateObject(state, {
                departments: state.departments.concat(action.result),
                department: state.department
            });
        case actionTypes.GET_ALL_DEPARTMENTS:
            let departments = action.result.filter(
                department => department.disable ===false
            );
            let disabledDepartments = action.result.filter(
                department => department.disable ===true
            );
            return updateObject(state, {
                departments: departments,
                department: state.department,
                disabledDepartments: disabledDepartments
            });
        case actionTypes.CLEAR_DEPARTMENT_FORM:
            return {
                ...state,
                department: {}
            };
        case actionTypes.DELETE_DEPARTMENT:
            state.departments = state.departments.filter(
                department => department.id !== action.result.id
            );
            state.disabledDepartments = state.disabledDepartments.filter(
                department => department.id !== action.result.id
            );
            return updateObject(state, {
                departments: state.departments,
                department: state.department,
                disabledDepartments: state.disabledDepartments
            });
        case actionTypes.GET_DISABLED_DEPARTMENTS:
            return updateObject(state, {
                departments: state.departments,
                department: state.department,
                disabledDepartments: action.result
            });
        case actionTypes.SET_DISABLED_DEPARTMENT:
            state.departments = state.departments.filter(
                department => department.id !== action.result.id
            );
            state.disabledDepartments.push(action.result)
            return updateObject(state, {
                departments: state.departments,
                department: state.department,
                disabledDepartments: state.disabledDepartments
            });
        case actionTypes.SET_ENABLED_DEPARTMENT:
            state.disabledDepartments = state.disabledDepartments.filter(
                department => department.id !== action.result.id
            );
            state.departments.push(action.result)
            return updateObject(state, {
                departments: state.departments,
                department: state.department,
                disabledDepartments: state.disabledDepartments
            });
        case actionTypes.GET_DEPARTMENT_BY_ID:
            let department = state.departments.filter(
                department => department.id === action.result
            )[0];
            if (!department) {
                department = { id: null };
            }
            return updateObject(state, {
                departments: state.departments,
                department: department
            });
        case actionTypes.UPDATE_DEPARTMENT:
            let updatedDepartments = [];
            state.departments.forEach(department => {
                if (department.id === action.result.id) {
                    department = { ...department, ...action.result };
                }
                updatedDepartments.push(department);
            });
            let updatedDefaultDepartments = [];
            state.disabledDepartments.forEach(department => {
                if (department.id === action.result.id) {
                    department = { ...department, ...action.result };
                }
                updatedDefaultDepartments.push(department);
            });

            return updateObject(state, {
                departments:updatedDepartments,
                disabledDepartments:updatedDefaultDepartments,
                department: {}
            });

        default:
            return state;
    }
};

export default departments;
