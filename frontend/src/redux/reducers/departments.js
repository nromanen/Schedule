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
            console.log("action.result",action.result)
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



        // case actionTypes.DELETE_SUBJECT:
        //     state.subjects = state.subjects.filter(
        //         subject => subject.id !== action.result
        //     );
        //     return updateObject(state, {
        //         subjects: state.subjects,
        //         subject: state.subject
        //     });
        //
        // case actionTypes.SHOW_ALL_SUBJECTS:
        //     return updateObject(state, {
        //         subjects: action.result,
        //         subject: state.subject
        //     });
        //
        // case actionTypes.SET_DISABLED_SUBJECTS:
        //     return updateObject(state, {
        //         disabledSubjects: action.result
        //     });
        //
        // case actionTypes.SELECT_SUBJECT:
        //     let subject = state.subjects.filter(
        //         subject => subject.id === action.result
        //     )[0];
        //     if (!subject) {
        //         subject = { id: null };
        //     }
        //     return updateObject(state, {
        //         subjects: state.subjects,
        //         subject: subject
        //     });
        //
        // case actionTypes.UPDATE_SUBJECT:
        //     const updatedSubjects = [];
        //     state.subjects.forEach(subject => {
        //         if (subject.id === action.result.id) {
        //             subject = { ...subject, ...action.result };
        //         }
        //         updatedSubjects.push(subject);
        //     });
        //     return updateObject(state, {
        //         subjects: updatedSubjects,
        //         subject: {}
        //     });
        //
        // case actionTypes.CLEAR_SUBJECT:
        //     return {
        //         ...state,
        //         subject: {}
        //     };

        default:
            return state;
    }
};

export default departments;
