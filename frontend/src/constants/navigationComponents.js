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
// export const dictionary=[
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
//     dictionary,
// ];
import AdminPage from '../containers/AdminPage/AdminPage';
import TeacherList from '../containers/TeachersList/TeachersList';
import GroupList from '../containers/GroupList/GroupList';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import React from 'react';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import Changes from '../components/ChangePasswordForm/ChangePasswordForm';
import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
export const dictionary=[
    // { name: 'LessonPage', component: <AdminPage /> },
    { name: 'TeacherList', component: <TeacherList /> },
    { name: 'GroupList', component: <GroupList /> },
    { name: 'ClassScheduleTitle', component: <ClassSchedule /> },
    { name: 'RoomList', component: <RoomList /> },
    { name: 'SubjectPage', component: <SubjectPage /> },
    // { name: 'BusyRooms', component: <BusyRooms /> },
    { name: 'SemesterPage', component: <SemesterPage /> },
    // { name: 'MergeRolePage', component: <MergeRolePage /> },
    // { name: 'Changes', component: <Changes /> },
    { name: 'Departments', component: <DepartmentPage /> },
];
export const tabs_components = [
    { name: 'LessonPage', component: <AdminPage /> },
    { name: 'MergeRolePage', component: <MergeRolePage /> },
    { name: 'Changes', component: <Changes /> },
    { name: 'BusyRooms', component: <BusyRooms /> },
    dictionary,
];

