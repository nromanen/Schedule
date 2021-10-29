import { updateObject } from '../utility';
import * as actionTypes from '../actions/actionsType';
import { makeFullSchedule } from '../mappers/fullScheduleMapper';
import { makeTeacherSchedule } from '../mappers/teacherScheduleMapper';
import { makeGroupSchedule } from '../mappers/groupScheduleMapper';

const initialState = {
    items: [],
    availability: {},
    itemsIds: [],
    fullSchedule: [],
    groupSchedule: {},
    teacherSchedule: {},
    scheduleType: 'full',
    scheduleGroupId: null,
    scheduleTeacherId: null,
    scheduleSemesterId: null,
    currentSemester: {},
    defaultSemester: {},
    viewTeacherScheduleResults: 'block-view',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SCHEDULE_ITEMS_SUCCESS:
            return updateObject(state, {
                items: action.items,
            });
        case actionTypes.GET_CURRENT_SEMESTER_SUCCESS:
            return updateObject(state, {
                currentSemester: action.semester,
            });
        case actionTypes.GET_DEFAULT_SEMESTER_SUCCESS:
            return updateObject(state, {
                defaultSemester: action.semester,
            });
        case actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_SUCCESS:
            return updateObject(state, {
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
            return updateObject(state, {
                items: itemArr,
            });
        }
        case actionTypes.SET_SCHEDULE_TYPE:
            return updateObject(state, {
                groupSchedule: {},
                fullSchedule: [],
                scheduleType: action.newType,
            });
        case actionTypes.GET_FULL_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeFullSchedule(action.schedule);
            return updateObject(state, {
                fullSchedule: mappedSchedule,
                groupSchedule: {},
                teacherSchedule: {},
            });
        }
        case actionTypes.GET_GROUP_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeGroupSchedule(action.schedule);
            return updateObject(state, {
                groupSchedule: mappedSchedule,
                teacherSchedule: {},
                fullSchedule: [],
            });
        }
        case actionTypes.SET_ITEM_GROUP_ID:
            return updateObject(state, {
                itemGroupId: action.result,
            });
        case actionTypes.SET_SCHEDULE_GROUP_ID:
            return updateObject(state, {
                scheduleGroupId: action.groupId,
            });
        case actionTypes.DELETE_SCHEDULE_ITEM_SUCCESS: {
            const index = state.items.findIndex((item) => item.id === action.itemId);
            state.items.splice(index, 1);
            const newArr = state.items;
            return updateObject(state, {
                items: newArr,
            });
        }
        case actionTypes.SET_SCHEDULE_TEACHER_ID:
            return updateObject(state, {
                scheduleTeacherId: action.teacherId,
            });
        case actionTypes.GET_TEACHER_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeTeacherSchedule(action.schedule);
            return updateObject(state, {
                teacherSchedule: mappedSchedule,
                groupSchedule: {},
                fullSchedule: [],
            });
        }
        case actionTypes.GET_ALL_PUBLIC_SEMESTERS_SUCCESS:
            return updateObject(state, {
                semesters: action.semesters,
            });
        case actionTypes.SET_SCHEDULE_SEMESTER_ID:
            return updateObject(state, {
                scheduleGroupId: null,
                scheduleTeacherId: null,
                scheduleSemesterId: action.semesterId,
            });
        case actionTypes.GET_TEACHER_RANGE_SCHEDULE_SUCCESS:
            return updateObject(state, {
                teacherRangeSchedule: action.schedule,
                scheduleGroupId: null,
                teacherSchedule: [],
                groupSchedule: {},
                fullSchedule: [],
            });
        case actionTypes.SET_TEACHER_VIEW_TYPE:
            return updateObject(state, {
                viewTeacherScheduleResults: action.result,
            });
        default:
            return state;
    }
};

export default reducer;
