import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    semesters: [],
    semester: {},
    archivedSemesters: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SEMESTER_SUCCESS:
            return updateObject(state, {
                semesters: state.semesters.concat(action.result),
                semester: {},
            });

        case actionTypes.DELETE_SEMESTER_SUCCESS: {
            const semesters = state.semesters.filter((semester) => semester.id !== action.result);
            return updateObject(state, {
                semesters,
            });
        }
        case actionTypes.SHOW_ALL_SEMESTERS_SUCCESS:
            return updateObject(state, {
                semesters: action.result.sort((a, b) => a.year - b.year),
                semester: state.semester,
            });
        case actionTypes.SET_DISABLED_SEMESTERS_SUCCESS:
            return updateObject(state, {
                disabledSemesters: action.result,
            });
        case actionTypes.SET_ARCHIVED_SEMESTERS_SUCCESS:
            return updateObject(state, {
                archivedSemesters: action.result,
            });

        case actionTypes.SELECT_SEMESTER_SUCCESS: {
            let selectSemesterSuccess = state.semesters.find(
                (semester) => semester.id === action.result,
            );
            if (!selectSemesterSuccess) {
                selectSemesterSuccess = {};
            }
            return updateObject(state, {
                semester: selectSemesterSuccess,
            });
        }
        case actionTypes.UPDATE_SEMESTER_SUCCESS: {
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
        case actionTypes.MOVE_SEMESTER_TO_ARCHIVE_SUCCESS: {
            const archivedSemester = state.semesters.find(
                (semester) => semester.id === action.result,
            );
            const semesters = state.semesters.filter((semester) => semester.id !== action.result);
            return updateObject(state, {
                semesters,
                archivedSemesters: [...state.archivedSemesters, archivedSemester],
            });
        }
        case actionTypes.CLEAR_SEMESTER_SUCCESS:
            return {
                ...state,
                semester: {},
            };

        default:
            return state;
    }
};

export default reducer;
