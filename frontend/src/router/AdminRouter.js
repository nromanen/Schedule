import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import LessonPage from '../containers/LessonPage/LessonPage';
import { links } from '../constants/links';
import TeacherList from '../containers/TeachersList/TeachersList';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import GroupList from '../containers/GroupList/GroupList';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
import TemporarySchedule from '../containers/TemporarySchedule/TemporarySchedule';
import { AdminRoute } from './routes';
import NavigationPanel from '../components/Navigation';

export default function Routers() {
    return (
        <>
            <NavigationPanel />
            <Switch>
                <AdminRoute links={links.DEPARTMENTS} component={DepartmentPage} />
                <AdminRoute links={links.LESSON_PAGE} component={LessonPage} />
                <AdminRoute links={links.TEACHER_LIST} component={TeacherList} />
                <AdminRoute links={links.GROUP_LIST} component={GroupList} />
                <AdminRoute links={links.CLASS_SCHEDULE_TITLE} component={ClassSchedule} />
                <AdminRoute links={links.ROOM_LIST} component={RoomList} />
                <AdminRoute links={links.SUBJECT_PAGE} component={SubjectPage} />
                <AdminRoute links={links.BUST_ROOMS} component={BusyRooms} />
                <AdminRoute links={links.SEMESTER_PAGE} component={SemesterPage} />
                <AdminRoute links={links.MARGE_ROLE_PAGE} component={MergeRolePage} />
                <AdminRoute links={links.CHANGES} component={TemporarySchedule} />

                <AdminRoute links={links.ACTIVATION_PAGE}>
                    <Redirect to={links.ADMIN_PAGE} />
                </AdminRoute>
                <AdminRoute links="/">
                    <Redirect to={links.LESSON_PAGE} />
                </AdminRoute>
            </Switch>
        </>
    );
}
