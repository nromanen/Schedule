import React from 'react';
import AdminPage from '../containers/AdminPage/AdminPage';
import TeacherList from '../containers/TeachersList/TeachersList';
import GroupList from '../containers/GroupList/GroupList';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import SemesterPage from '../containers//SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import Changes from '../components/ChangePasswordForm/ChangePasswordForm';
import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
import { navigationNames } from './navigation';

export const general = [
    { name: navigationNames.GENERAL },
    { name: navigationNames.CLASS_SCHEDULE_TITLE, component: <ClassSchedule /> },
    { name: navigationNames.DEPARTMENTS, component: <DepartmentPage /> },
    { name: navigationNames.GROUP_LIST, component: <GroupList /> },
    { name: navigationNames.ROOM_LIST, component: <RoomList /> },
    { name: navigationNames.SUBJECT_PAGE, component: <SubjectPage /> },
    { name: navigationNames.SEMESTER_PAGE, component: <SemesterPage /> },
    { name: navigationNames.TEACHER_LIST, component: <TeacherList /> },
];
export const tabsComponents = [
    { name: navigationNames.LESSON_PAGE, component: <AdminPage /> },
    { name: navigationNames.MERGE_ROLE_PAGE, component: <MergeRolePage /> },
    { name: navigationNames.CHANGES, component: <Changes /> },
    { name: navigationNames.BUSY_ROOMS, component: <BusyRooms /> },
    general,
];
