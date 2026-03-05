import * as actionTypes from '../actions/actionsType';

const initialState = {
    departments: [],
    department: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ALL_DEPARTMENTS: {
            const departments = action.result.filter((department) => department.disable === false);
            return { ...state, departments };
        }

        case actionTypes.GET_DEPARTMENT_BY_ID: {
            let getDepartment = state.departments.find(
                (department) => department.id === action.result,
            );
            if (!getDepartment) {
                getDepartment = { id: null };
            }
            return { ...state, department: getDepartment };
        }

        default:
            return state;
    }
};

export default reducer;