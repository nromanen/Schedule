import * as actionTypes from '../actions/actionsType';
function compare(a, b) {
    let comparison = 0;
    if (a.surname > b.surname) {
        comparison = 1;
    } else if (a.surname < b.surname) {
        comparison = -1;
    }
    return comparison;
}

const teachers = (
    state = {
        teachers: [],
        teacher: {},
        disabledTeachers: []
    },
    action
) => {
    switch (action.type) {
        case actionTypes.ADD_TEACHER:
            return {
                ...state,
                teachers: [...state.teachers, action.result].sort(compare)
            };

        case actionTypes.DELETE_TEACHER:
            return {
                ...state,
                teachers: [
                    ...state.teachers.filter(
                        teachers => teachers.id !== action.result
                    )
                ]
            };

        case actionTypes.SET_TEACHER:
            return {
                ...state,
                teacher: action.result
            };
        case actionTypes.SELECT_TEACHER:
            let teacher = state.teachers.filter(
                teacher => teacher.id === action.result
            )[0];
            if (!teacher) {
                teacher = { id: null };
            }
            return {
                ...state,
                teacher: teacher
            };

        case actionTypes.UPDATE_TEACHER:
            const updatedTeacher = [];
            state.teachers.forEach(teacher => {
                if (teacher.id === action.result.id) {
                    teacher = { ...teacher, ...action.result };
                }
                updatedTeacher.push(teacher);
            });
            return {
                ...state,
                teacher: {},
                teachers: updatedTeacher
            };

        case actionTypes.SHOW_ALL:
            return {
                ...state,
                teachers: [...action.result]
            };
        case actionTypes.SET_DISABLED_TEACHERS:
            return {
                ...state,
                disabledTeachers: [...action.result]
            };
        case actionTypes.GET_TEACHERS_BY_DEPARTMENT:
            return {
            ...state,
            teachers: [...action.result]
        };

        default:
            return state;
    }
};

export default teachers;
