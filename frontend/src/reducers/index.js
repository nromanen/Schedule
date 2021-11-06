import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import teachers from './teachers';
import lesson from './lesson';
import temporarySchedule from './temporarySchedule';
import snackbar from './snackbar';
import auth from './auth';
import loadingIndicator from './loadingIndicator';
import schedule from './schedule';
import classActions from './class';
import subjects from './subjects';
import groups from './groups';
import rooms from './rooms';
import roomTypes from './roomTypes';
import busyRooms from './busyRooms';
import semesters from './semesters';
import users from './users';
import freeRooms from './freeRooms';
import departments from './departments';
import students from './students';
import dialog from './dialog';
import sidebar from './sidebar';

const rootReducer = combineReducers({
    lesson,
    temporarySchedule,
    auth,
    snackbar,
    schedule,
    users,
    loadingIndicator,
    classActions,
    teachers,
    subjects,
    groups,
    rooms,
    roomTypes,
    busyRooms,
    semesters,
    freeRooms,
    departments,
    students,
    dialog,
    sidebar,

    form: formReducer,
});

export default rootReducer;
