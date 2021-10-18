import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import AdminPage from '../containers/AdminPage/AdminPage';
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
import NavigationPage from '../components/Navigation/NavigationPage';

export default function Routers() {
    return (
        <>
            <NavigationPage />
            <Switch>
                <AdminRoute path={links.Departments} component={DepartmentPage} />
                <AdminRoute path={links.LessonPage} component={AdminPage} />
                <AdminRoute path={links.TeacherList} component={TeacherList} />
                <AdminRoute path={links.GroupList} component={GroupList} />

                {/* <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.Edit}${links.IdParam}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.Delete}${links.IdParam}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.IdParam}${links.AddStudent}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.IdParam}${links.SetDisable}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.IdParam}${links.ShowStudents}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.IdParam}${links.Student}${links.IdStudentParam}${links.Edit}`}
                    component={GroupList}
                />
                <AdminRoute
                    path={`${links.GroupList}${links.Group}${links.IdParam}${links.Student}${links.IdStudentParam}${links.Delete}`}
                    component={GroupList}
                /> */}

                <AdminRoute path={links.ClassScheduleTitle} component={ClassSchedule} />
                <AdminRoute path={links.RoomList} component={RoomList} />
                <AdminRoute path={links.SubjectPage} component={SubjectPage} />
                <AdminRoute path={links.BusyRooms} component={BusyRooms} />
                <AdminRoute path={links.SemesterPage} component={SemesterPage} />
                <AdminRoute path={links.MergeRolePage} component={MergeRolePage} />
                <AdminRoute path={links.Changes} component={TemporarySchedule} />

                <AdminRoute path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.ADMIN_PAGE} />
                </AdminRoute>
                <AdminRoute path="/">
                    <Redirect to={links.LessonPage} />
                </AdminRoute>
            </Switch>
        </>
    );
}
