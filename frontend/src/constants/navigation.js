import React from 'react';
import TeacherList from '../containers/TeachersList/TeachersList';
import GroupList from '../containers/GroupList/GroupList';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import Changes from '../components/ChangePasswordForm/ChangePasswordForm';
import BusyRooms from '../containers/BusyRooms/BusyRooms';

export const navigation = {
    LESSONS: 0,
    USERS: 1,
    CHANGES: 2,
    BUSY_ROOMS: 3,
    PERIOD: 4,
    DEPARTMENTS: 5,
    GROUPS: 6,
    ROOMS: 7,
    SUBJECTS: 8,
    SEMESTERS: 9,
    TEACHERS: 10,
};
export const navigationNames = {
    TEACHER_LIST: 'TeacherList',
    GROUP_LIST: 'GroupList',
    CLASS_SCHEDULE_TITLE: 'ClassScheduleTitle',
    ROOM_LIST: 'RoomList',
    SUBJECT_PAGE: 'SubjectPage',
    SEMESTER_PAGE: 'SemesterPage',
    DEPARTMENTS: 'Departments',
    LESSON_PAGE: 'LessonPage',
    MERGE_ROLE_PAGE: 'MergeRolePage',
    CHANGES: 'Changes',
    BUSY_ROOMS: 'BusyRooms',
    GENERAL: 'General',
};
