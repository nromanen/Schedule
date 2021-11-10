import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import LessonPage from '../containers/LessonPage/LessonPage';
import {
    DEPARTMENTS_LINK,
    LESSON_PAGE_LINK,
    TEACHER_LIST_LINK,
    GROUP_LIST_LINK,
    CLASS_SCHEDULE_TITLE_LINK,
    ROOM_LIST_LINK,
    SUBJECT_PAGE_LINK,
    BUST_ROOMS_LINK,
    SEMESTER_PAGE_LINK,
    MARGE_ROLE_PAGE_LINK,
    CHANGES_LINK,
    ADMIN_PAGE_LINK,
    ACTIVATION_PAGE_LINK,
} from '../constants/links';
import TeacherPage from '../components/TeachersPage/TeachersPage';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import GroupList from '../containers/GroupPage/GroupPage';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
import TemporarySchedule from '../containers/TemporarySchedule/TemporarySchedule';
import { AdminRoute } from './routes';
import NavigationPanel from '../components/Navigation/NavigationPanel';

export default function Routers() {
    return (
        <>
            <NavigationPanel />
            <Switch>
                <AdminRoute path={DEPARTMENTS_LINK} component={DepartmentPage} />
                <AdminRoute path={LESSON_PAGE_LINK} component={LessonPage} />
                <AdminRoute path={TEACHER_LIST_LINK} component={TeacherPage} />
                <AdminRoute path={GROUP_LIST_LINK} component={GroupList} />
                <AdminRoute path={CLASS_SCHEDULE_TITLE_LINK} component={ClassSchedule} />
                <AdminRoute path={ROOM_LIST_LINK} component={RoomList} />
                <AdminRoute path={SUBJECT_PAGE_LINK} component={SubjectPage} />
                <AdminRoute path={BUST_ROOMS_LINK} component={BusyRooms} />
                <AdminRoute path={SEMESTER_PAGE_LINK} component={SemesterPage} />
                <AdminRoute path={MARGE_ROLE_PAGE_LINK} component={MergeRolePage} />
                <AdminRoute path={CHANGES_LINK} component={TemporarySchedule} />

                <AdminRoute path={ACTIVATION_PAGE_LINK}>
                    <Redirect to={ADMIN_PAGE_LINK} />
                </AdminRoute>
                <AdminRoute path="/">
                    <Redirect to={LESSON_PAGE_LINK} />
                </AdminRoute>
            </Switch>
        </>
    );
}
