import * as actionTypes from '../actions/actionsType';

const initialState = {
    semesters: [],
    semester: {},
    archivedSemesters: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SEMESTER:
            return { ...state, semesters: state.semesters.concat(action.item), semester: {} };

        case actionTypes.DELETE_SEMESTER: {
            const semesters = state.semesters.filter(
                (semester) => semester.id !== action.semesterId,
            );
            return { ...state, semesters };
        }
        case actionTypes.SHOW_ALL_SEMESTERS:
            return {
                ...state,
                semesters: action.semesters.sort((a, b) => a.year - b.year),
                semester: state.semester,
            };
        case actionTypes.SET_DISABLED_SEMESTERS:
            return { ...state, disabledSemesters: action.semesters };

        case actionTypes.SET_ARCHIVED_SEMESTERS:
            return { ...state, archivedSemesters: action.semesters };

        case actionTypes.SELECT_SEMESTER: {
            let selectSemester = state.semesters.find(
                (semester) => semester.id === action.semesterId,
            );
            if (!selectSemester) {
                selectSemester = {};
            }
            return { ...state, semester: selectSemester };
        }
        case actionTypes.UPDATE_SEMESTER: {
            const semesterIndex = state.semesters.findIndex(({ id }) => id === action.semester.id);
            const semesters = [...state.semesters];
            semesters[semesterIndex] = {
                ...semesters[semesterIndex],
                ...action.semester,
            };
            return { ...state, semesters, semester: {} };
        }
        case actionTypes.MOVE_SEMESTER_TO_ARCHIVE: {
            const archivedSemester = state.semesters.find(
                (semester) => semester.id === action.result,
            );
            const semesters = state.semesters.filter(
                (semester) => semester.id !== action.semesterId,
            );
            return {
                ...state,
                semesters,
                archivedSemesters: [...state.archivedSemesters, archivedSemester],
            };
        }
        case actionTypes.CLEAR_SEMESTER:
            return {
                ...state,
                semester: {},
            };

        default:
            return state;
    }
};

export default reducer;
