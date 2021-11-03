import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    semesters: [],
    semester: {},
    archivedSemesters: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SEMESTER:
            return updateObject(state, {
                semesters: state.semesters.concat(action.result),
                semester: {},
            });

        case actionTypes.DELETE_SEMESTER: {
            const semesters = state.semesters.filter((semester) => semester.id !== action.result);
            return updateObject(state, {
                semesters,
            });
        }
        case actionTypes.SHOW_ALL_SEMESTERS:
            return updateObject(state, {
                semesters: action.result.sort((a, b) => a.year - b.year),
                semester: state.semester,
            });
        case actionTypes.SET_DISABLED_SEMESTERS:
            return updateObject(state, {
                disabledSemesters: action.result,
            });
        case actionTypes.SET_ARCHIVED_SEMESTERS:
            return updateObject(state, {
                archivedSemesters: action.result,
            });

        case actionTypes.SELECT_SEMESTER: {
            let selectSemester = state.semesters.find((semester) => semester.id === action.result);
            if (!selectSemester) {
                selectSemester = {};
            }
            return updateObject(state, {
                semester: selectSemester,
            });
        }
        case actionTypes.UPDATE_SEMESTER: {
            const semesterIndex = state.semesters.findIndex(({ id }) => id === action.result.id);
            const semesters = [...state.semesters];
            semesters[semesterIndex] = {
                ...semesters[semesterIndex],
                ...action.result,
            };
            return updateObject(state, {
                semesters,
                semester: {},
            });
        }
        case actionTypes.MOVE_SEMESTER_TO_ARCHIVE: {
            const archivedSemester = state.semesters.find(
                (semester) => semester.id === action.result,
            );
            const semesters = state.semesters.filter((semester) => semester.id !== action.result);
            return updateObject(state, {
                semesters,
                archivedSemesters: [...state.archivedSemesters, archivedSemester],
            });
        }
        case actionTypes.CLEAR_SEMESTER:
            return {
                ...state,
                semester: {},
            };
        case actionTypes.SET_ERROR:
            return updateObject(state, {
                uniqueError: action.result,
            });

        default:
            return state;
    }
};

export default reducer;
