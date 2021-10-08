import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    departments: [],
    department: {},
    disabledDepartments: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_DEPARTMENT:
            return updateObject(state, {
                departments: state.departments.concat(action.result),
            });
        case actionTypes.GET_ALL_DEPARTMENTS: {
            const departments = action.result.filter((department) => department.disable === false);
            const disabledDepartments = action.result.filter(
                (department) => department.disable === true,
            );
            return updateObject(state, {
                departments,
                disabledDepartments,
            });
        }
        case actionTypes.CLEAR_DEPARTMENT_FORM:
            return {
                ...state,
                department: {},
            };
        case actionTypes.DELETE_DEPARTMENT: {
            const departments = state.departments.filter(
                (department) => department.id !== action.result.id,
            );
            const disabledDepartments = state.disabledDepartments.filter(
                (department) => department.id !== action.result.id,
            );
            return updateObject(state, {
                departments,
                disabledDepartments,
            });
        }
        case actionTypes.GET_DISABLED_DEPARTMENTS:
            return updateObject(state, {
                disabledDepartments: action.result,
            });
        case actionTypes.SET_DISABLED_DEPARTMENT: {
            const departments = state.departments.filter(
                (department) => department.id !== action.result.id,
            );
            const disabledDepartments = [...state.disabledDepartments, action.result];
            return updateObject(state, {
                departments,
                disabledDepartments,
            });
        }
        case actionTypes.SET_ENABLED_DEPARTMENT: {
            const disabledDepartments = state.disabledDepartments.filter(
                (department) => department.id !== action.result.id,
            );
            const departments = [...state.departments, action.result];
            return updateObject(state, {
                departments,
                disabledDepartments,
            });
        }
        case actionTypes.GET_DEPARTMENT_BY_ID: {
            let getDepartment = state.departments.filter(
                (department) => department.id === action.result,
            )[0];
            if (!getDepartment) {
                getDepartment = { id: null };
            }
            return updateObject(state, {
                department: getDepartment,
            });
        }
        case actionTypes.UPDATE_DEPARTMENT: {
            const updatedDepartments = state.departments.map((department) => {
                if (department.id === action.result.id) {
                    return { ...department, ...action.result };
                }
                return department;
            });

            const updatedDisabledDepartments = state.disabledDepartments.map((disabledDept) => {
                if (disabledDept.id === action.result.id) {
                    return { ...disabledDept, ...action.result };
                }
                return disabledDept;
            });

            return updateObject(state, {
                departments: updatedDepartments,
                disabledDepartments: updatedDisabledDepartments,
                department: {},
            });
        }

        default:
            return state;
    }
};

export default reducer;
