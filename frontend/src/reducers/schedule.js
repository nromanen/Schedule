import * as actionTypes from '../actions/actionsType';
import {makeFullSchedule} from '../mappers/fullScheduleMapper';
import {makeTeacherSchedule} from '../mappers/teacherScheduleMapper';
import {makeGroupSchedule} from '../mappers/groupScheduleMapper';
import {places} from '../constants/places';

const initialState = {
    items: [],
    itemsIds: [],
    fullSchedule: [],
    groupSchedule: {},
    teacherSchedule: {},
    teacherRangeSchedule: null,

    scheduleType: 'full',
    scheduleSemester: null,
    scheduleGroup: null,
    scheduleTeacher: null,
    scheduleDepartment: null,

    currentSemester: {},
    defaultSemester: {},
    semesters: [],

    place: localStorage.getItem('place') || places.TOGETHER,
    viewTeacherScheduleResults: 'block-view',

    notPublished: false,
    notPublishedMessage: null,

    availability: {},
    itemGroupId: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_CURRENT_SEMESTER_SUCCESS:
            return {...state, currentSemester: action.semester};

        case actionTypes.GET_DEFAULT_SEMESTER_SUCCESS:
            return {...state, defaultSemester: action.semester};

        case actionTypes.GET_ALL_PUBLIC_SEMESTERS_SUCCESS:
            return {...state, semesters: action.semesters};

        case actionTypes.SET_SCHEDULE_SEMESTER:
            return {
                ...state,
                scheduleSemester: action.semester,
                scheduleGroup: null,
                scheduleTeacher: null,
                scheduleDepartment: null,
            };

        case actionTypes.SET_SCHEDULE_GROUP:
            return {
                ...state,
                scheduleGroup: action.group,
                scheduleTeacher: null,
                scheduleDepartment: null
            };

        case actionTypes.SET_SCHEDULE_TEACHER:
            return {
                ...state,
                scheduleTeacher: action.teacher,
                scheduleGroup: null,
                scheduleDepartment: null
            };

        case actionTypes.SET_SCHEDULE_DEPARTMENT:
            return {
                ...state,
                scheduleDepartment: action.department,
                scheduleGroup: null,
                scheduleTeacher: null
            };

        case actionTypes.SET_SCHEDULE_TYPE:
            return {
                ...state,
                scheduleType: action.newType,
                groupSchedule: {},
                fullSchedule: []
            };

        case actionTypes.GET_FULL_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeFullSchedule(action.schedule);
            return {
                ...state,
                fullSchedule: mappedSchedule,
                groupSchedule: {},
                teacherSchedule: {},
                notPublished: false,
                notPublishedMessage: null,
            };
        }

        case actionTypes.GET_GROUP_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeGroupSchedule(action.schedule);
            return {
                ...state,
                groupSchedule: mappedSchedule,
                fullSchedule: [],
                teacherSchedule: {},
                notPublished: false,
                notPublishedMessage: null,
            };
        }

        case actionTypes.GET_TEACHER_SCHEDULE_SUCCESS: {
            const mappedSchedule = makeTeacherSchedule(action.schedule);
            return {
                ...state,
                teacherSchedule: mappedSchedule,
                fullSchedule: [],
                groupSchedule: {},
                notPublished: false,
                notPublishedMessage: null,
            };
        }

        case actionTypes.GET_TEACHER_RANGE_SCHEDULE_SUCCESS:
            return {
                ...state,
                teacherRangeSchedule: action.schedule,
                fullSchedule: [],
                groupSchedule: {},
                teacherSchedule: [],
                scheduleGroup: null,
            };


        case actionTypes.GET_SCHEDULE_ITEMS_SUCCESS:
            return {...state, items: action.items};

        case actionTypes.ADD_ITEM_TO_SCHEDULE: {
            const {id} = action.payload;
            let itemArr;
            if (id) {
                const index = state.items.findIndex((item) => item.id === id);
                if (index < 0) {
                    itemArr = state.items.concat(action.payload);
                } else {
                    state.items.splice(index, 1, action.payload);
                    itemArr = state.items;
                }
            } else {
                itemArr = state.items.concat(action.payload);
            }
            return {...state, items: itemArr};
        }

        case actionTypes.DELETE_SCHEDULE_ITEM_SUCCESS: {
            const index = state.items.findIndex((item) => item.id === action.itemId);
            state.items.splice(index, 1);
            const newArr = state.items;
            return {...state, items: newArr};
        }

        case actionTypes.SET_ITEM_GROUP_ID:
            return {...state, itemGroupId: action.payload};


        case actionTypes.SET_PLACE:
            return {...state, place: action.place};

        case actionTypes.SET_TEACHER_VIEW_TYPE:
            return {...state, viewTeacherScheduleResults: action.payload};


        case actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_SUCCESS:
            return {...state, availability: action.payload};

        case actionTypes.SCHEDULE_NOT_PUBLISHED:
            return {
                ...state,
                notPublished: true,
                notPublishedMessage: action.payload,
            };


        default:
            return state;
    }
};

export default reducer;