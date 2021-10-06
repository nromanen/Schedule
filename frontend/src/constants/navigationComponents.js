// import AdminPage from '../containers/AdminPage/AdminPage';
// import TeacherList from '../containers/TeachersList/TeachersList';
// import GroupList from '../containers/GroupList/GroupList';
// import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
// import RoomList from '../containers/RoomList/RoomList';
// import SubjectPage from '../containers/SubjectPage/SubjectPage';
// import BusyRooms from '../containers/BusyRooms/BusyRooms';
// import React from 'react';
// import SemesterPage from '../containers/SemesterPage/SemesterPage';
// import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
// import Changes from '../components/ChangePasswordForm/ChangePasswordForm';
// import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
// export const general=[
//     { name: 'SemesterPage', component: <SemesterPage /> },
//     { name: 'MergeRolePage', component: <MergeRolePage /> },
//     { name: 'Changes', component: <Changes /> },
//     { name: 'Departments', component: <DepartmentPage /> }];
// export const tabs_components = [
//     { name: 'LessonPage', component: <AdminPage /> },
//     { name: 'TeacherList', component: <TeacherList /> },
//     { name: 'GroupList', component: <GroupList /> },
//     { name: 'ClassScheduleTitle', component: <ClassSchedule /> },
//     { name: 'RoomList', component: <RoomList /> },
//     { name: 'SubjectPage', component: <SubjectPage /> },
//     { name: 'BusyRooms', component: <BusyRooms /> },
//     // { name: 'SemesterPage', component: <SemesterPage /> },
//     // { name: 'MergeRolePage', component: <MergeRolePage /> },
//     // { name: 'Changes', component: <Changes /> },
//     // { name: 'Departments', component: <DepartmentPage /> },
//     general,
// ];
import React from 'react';
import AdminPage from '../containers/AdminPage/AdminPage';
import TeacherList from '../containers/TeachersList/TeachersList';
import GroupList from '../containers/GroupList/GroupList';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
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
export const tabs_components = [
    { name: navigationNames.LESSON_PAGE, component: <AdminPage /> },
    { name: navigationNames.MERGE_ROLE_PAGE, component: <MergeRolePage /> },
    { name: navigationNames.CHANGES, component: <Changes /> },
    { name: navigationNames.BUSY_ROOMS, component: <BusyRooms /> },
    general,
];
