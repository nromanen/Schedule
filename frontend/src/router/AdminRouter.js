import React from 'react';
import {Redirect, Switch} from 'react-router-dom';

import LessonPage from '../containers/LessonPage/LessonPage';
import {
    ACTIVATION_PAGE_LINK,
    ADMIN_PAGE_LINK,
    BUST_ROOMS_LINK,
    CHANGES_LINK,
    CLASS_SCHEDULE_TITLE_LINK,
    DEPARTMENTS_LINK,
    GROUP_LIST_PARAM_LINK,
    LESSON_PAGE_LINK,
    MARGE_ROLE_PAGE_LINK,
    ROOM_LIST_LINK,
    SEMESTER_PAGE_LINK,
    SUBJECT_PAGE_LINK,
    TEACHER_LESSONS_LINK,
    TEACHER_LIST_LINK,
} from '../constants/links';
import TeachersPage from '../containers/TeachersPage/TeachersPage';
import BusyRoomsPage from '../containers/Rooms/BusyRoomsPage';
import GroupList from '../containers/GroupPage/GroupPage';
import ClassSchedule from '../containers/ClassSchedule/ClassSchedule';
import RoomPage from '../containers/RoomsPage/RoomsPage';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import DepartmentPage from '../containers/DepartmentPage/DepartmentPage';
import TemporarySchedule from '../containers/TemporarySchedule/TemporarySchedule';
import {AdminRoute} from './routes';
import NavigationPanel from '../components/Navigation/NavigationPanel';
import TeacherLessonsPage from '../components/TeacherLessonsPage/TeacherLessonsPage';


export default function Routers() {
    return (
        <>
            <NavigationPanel />
            <Switch>
                <AdminRoute path={DEPARTMENTS_LINK} component={DepartmentPage} />
                <AdminRoute path={LESSON_PAGE_LINK} component={LessonPage} />
                <AdminRoute path={TEACHER_LIST_LINK} component={TeachersPage} />
                <AdminRoute path={GROUP_LIST_PARAM_LINK} component={GroupList} />
                <AdminRoute path={CLASS_SCHEDULE_TITLE_LINK} component={ClassSchedule} />
                <AdminRoute path={ROOM_LIST_LINK} component={RoomPage} />
                <AdminRoute path={SUBJECT_PAGE_LINK} component={SubjectPage} />
                <AdminRoute path={BUST_ROOMS_LINK} component={BusyRoomsPage} />
                <AdminRoute path={SEMESTER_PAGE_LINK} component={SemesterPage} />
                <AdminRoute path={MARGE_ROLE_PAGE_LINK} component={MergeRolePage} />
                <AdminRoute path={CHANGES_LINK} component={TemporarySchedule} />

                <AdminRoute path={TEACHER_LESSONS_LINK} component={TeacherLessonsPage} />

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
