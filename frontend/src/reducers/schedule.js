import { assign } from 'lodash';
import * as actionTypes from '../actions/actionsType';

const initialState = {
    items: [],
    availability: {},
    itemsIds: [],
    fullSchedule: [],
    groupSchedule: {},
    scheduleType: '',
    scheduleGroupId: 0,
    currentSemester: {},
    defaultSemester: {},
    viewTeacherScheduleResults: 'block-view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCHEDULE_ITEMS:
            return assign(state, {
                items: action.result,
            });
        case actionTypes.SET_CURRENT_SEMESTER:
            return assign(state, {
                currentSemester: action.payload,
            });
        case actionTypes.SET_DEFAULT_SEMESTER:
            return assign(state, {
                defaultSemester: action.payload,
            });
        case actionTypes.CHECK_AVAILABILITY_SCHEDULE:
            return assign(state, {
                availability: action.result,
            });
        case actionTypes.ADD_ITEM_TO_SCHEDULE: {
            const { id } = action.result;
            let itemArr;
            if (id) {
                const index = state.items.findIndex((item) => {
                    return item.id === id;
                });
                if (index < 0) {
                    itemArr = state.items.concat(action.result);
                } else {
                    state.items.splice(index, 1, action.result);
                    itemArr = state.items;
                }
            } else {
                itemArr = state.items.concat(action.result);
            }
            return assign(state, {
                items: itemArr,
            });
        }
        case actionTypes.SET_SCHEDULE_TYPE:
            return assign(state, {
                groupSchedule: {},
                fullSchedule: [],
                scheduleType: action.newType,
            });
        case actionTypes.SET_FULL_SCHEDULE:
            assign(state, {
                fullSchedule: [],
                groupSchedule: {}, // nani desu ka?
            });
            return assign(state, {
                fullSchedule: action.result,
            });
        case actionTypes.SET_GROUP_SCHEDULE:
            return assign(state, {
                groupSchedule: action.result, // nani desu ka?
                fullSchedule: [],
            });
        case actionTypes.SET_ITEM_GROUP_ID:
            return assign(state, {
                itemGroupId: action.result,
            });
        case actionTypes.SET_SCHEDULE_GROUP_ID:
            return assign(state, {
                scheduleGroupId: action.groupId,
                scheduleTeacherId: null,
                fullSchedule: [],
                groupSchedule: {},
            });
        case actionTypes.DELETE_ITEM_FROM_SCHEDULE: {
            const index = state.items.findIndex((item) => item.id === action.result);
            state.items.splice(index, 1);
            const newArr = state.items;
            return assign(state, {
                items: newArr,
            });
        }
        case actionTypes.SET_SCHEDULE_TEACHER_ID:
            return assign(state, {
                scheduleGroupId: null,
                scheduleTeacherId: action.teacherId,
                fullSchedule: [],
                groupSchedule: {},
            });
        case actionTypes.SET_TEACHER_SCHEDULE:
            return assign(state, {
                scheduleGroupId: null,
                teacherSchedule: action.result,
                scheduleTeacherId: `${action.result.teacher.id}`,
                groupSchedule: {},
                fullSchedule: [],
            });
        case actionTypes.SET_SEMESTER_LIST:
            return assign(state, {
                semesters: action.result,
            });
        case actionTypes.SET_SCHEDULE_SEMESTER_ID:
            return assign(state, {
                scheduleGroupId: null,
                scheduleTeacherId: null,
                scheduleSemesterId: action.semesterId,
                fullSchedule: [],
                groupSchedule: {},
            });
        case actionTypes.SET_TEACHER_RANGE_SCHEDULE:
            return assign(state, {
                teacherRangeSchedule: action.result,
                scheduleGroupId: null,
                teacherSchedule: [],
                groupSchedule: {},
                fullSchedule: [],
            });
        case actionTypes.SET_TEACHER_VIEW_TYPE:
            return assign(state, {
                viewTeacherScheduleResults: action.result,
            });
        default:
            return state;
    }
};

export default reducer;
