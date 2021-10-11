import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

function compare(a, b) {
    let comparison = 0;
    if (a.surname > b.surname) {
        comparison = 1;
    } else if (a.surname < b.surname) {
        comparison = -1;
    }
    return comparison;
}

const reducer = (
    state = {
        teachers: [],
        teacher: {},
        disabledTeachers: [],
    },
    action,
) => {
    switch (action.type) {
        case actionTypes.ADD_TEACHER:
            return updateObject(state, {
                teachers: [...state.teachers, action.result].sort(compare),
            });

        case actionTypes.DELETE_TEACHER:
            return updateObject(state, {
                teachers: [...state.teachers.filter((teacher) => teacher.id !== action.result)],
            });

        case actionTypes.SET_TEACHER:
            return updateObject(state, {
                teacher: action.result,
            });
        case actionTypes.SELECT_TEACHER: {
            let teacher = state.teachers.find((teach) => teach.id === action.result);
            if (!teacher) {
                teacher = { id: null };
            }
            return updateObject(state, {
                teacher,
            });
        }
        case actionTypes.UPDATE_TEACHER: {
            const teacherIndex = state.teachers.findIndex(({ id }) => id === action.result.id);
            const teachers = [...state.teachers];
            teachers[teacherIndex] = {
                ...teachers[teacherIndex],
                ...action.result,
            };
            return updateObject(state, {
                teacher: {},
                teachers,
            });
        }

        case actionTypes.SET_DISABLED_TEACHERS:
            return updateObject(state, {
                disabledTeachers: [...action.result],
            });
        case actionTypes.SHOW_ALL:
        case actionTypes.GET_TEACHERS_BY_DEPARTMENT:
            return updateObject(state, {
                teachers: [...action.result],
            });

        default:
            return state;
    }
};

export default reducer;
