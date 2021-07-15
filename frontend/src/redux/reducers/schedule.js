import * as actionTypes from '../actions/actionsType';
import { updateObject } from '../utility';

const initialState = {
    items: [],
    availability: {},
    itemsIds: [],
    fullSchedule: [],
    groupSchedule: {},
    scheduleType: '',
    scheduleGroupId: 0,
    currentSemester: {},
    viewTeacherScheduleResults: 'block-view'
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCHEDULE_ITEMS:
            return updateObject(state, {
                items: action.result
            });
        case actionTypes.SET_CURRENT_SEMESTER:
            return updateObject(state, {
                currentSemester: action.result
            });
        case actionTypes.CHECK_AVAILABILITY_SCHEDULE:
            return updateObject(state, {
                availability: action.result
            });
        case actionTypes.ADD_ITEM_TO_SCHEDULE:
            const id = action.result.id;
            let itemArr;
            if (id) {
                const index = state.items.findIndex(item => {
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
            return updateObject(state, {
                items: itemArr
            });
        case actionTypes.SET_SCHEDULE_TYPE:
            return updateObject(state, {
                groupSchedule: {},
                fullSchedule: [],
                scheduleType: action.newType
            });
        case actionTypes.SET_FULL_SCHEDULE:
            updateObject(state, {
                fullSchedule: [],
                groupSchedule: {}
            });
            return updateObject(state, {
                fullSchedule: action.result
            });
        case actionTypes.SET_GROUP_SCHEDULE:
            return updateObject(state, {
                groupSchedule: action.result,
                fullSchedule: [],

            });
        case actionTypes.SET_ITEM_GROUP_ID:
            return updateObject(state, {
                itemGroupId: action.result
            });
        case actionTypes.SET_SCHEDULE_GROUP_ID:
            return updateObject(state, {
                scheduleGroupId: action.groupId,
                scheduleTeacherId: null,
                fullSchedule: [],
                groupSchedule: {}
            });
        case actionTypes.DELETE_ITEM_FROM_SCHEDULE:
            const index = state.items.findIndex(
                item => item.id === action.result
            );
            state.items.splice(index, 1);
            const newArr = state.items;
            return updateObject(state, {
                items: newArr
            });

        case actionTypes.SET_SCHEDULE_TEACHER_ID:
            return updateObject(state, {
                scheduleGroupId: null,
                scheduleTeacherId: action.teacherId,
                fullSchedule: [],
                groupSchedule: {}
            });
        case actionTypes.SET_TEACHER_SCHEDULE:
            return updateObject(state, {
                scheduleGroupId: null,
                teacherSchedule: action.result,
                scheduleTeacherId:`${action.result.teacher.id}`,
                groupSchedule: {},
                fullSchedule: []
            });
        case actionTypes.SET_SEMESTER_LIST:
            return updateObject(state, {
                scheduleGroupId: null,
                scheduleTeacherId: null,
                teacherSchedule: {},
                groupSchedule: {},
                fullSchedule: [],
                semesters: action.result
            });
        case actionTypes.SET_SCHEDULE_SEMESTER_ID:
            return updateObject(state, {
                scheduleGroupId: null,
                scheduleTeacherId: null,
                scheduleSemesterId: action.semesterId,
                fullSchedule: [],
                groupSchedule: {}
            });
        case actionTypes.SET_TEACHER_RANGE_SCHEDULE:
            return updateObject(state, {
                teacherRangeSchedule: action.result,
                scheduleGroupId: null,
                teacherSchedule: [],
                groupSchedule: {},
                fullSchedule: []
            });
        case actionTypes.SET_TEACHER_VIEW_TYPE:
            return updateObject(state, {
                viewTeacherScheduleResults: action.result
            });
        default:
            return state;
    }
};

export default reducer;
