import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../components/Header/Header';

import HomePage from '../containers/Home/Home';
import TeacherSchedule from '../components/TeacherSchedule/TeacherSchedule';
import SchedulePage from '../containers/SchedulePage/SchedulePage';
import AdminPage from '../containers/AdminPage/AdminPage';
import Logout from '../containers/Auth/Logout/Logout';
import ActivationPage from '../containers/ActivationPage/ActivationPage';
import ProfilePage from '../containers/ProfilePage/ProfilePage';
import { links } from '../constants/links';
import { userRoles } from '../constants/userRoles';
import TeacherList from '../containers/TeachersList/TeachersList';
import BusyRooms from '../containers/BusyRooms/BusyRooms';
import GroupList from '../containers/GroupList/GroupList';
import ClassSchedule  from '../containers/ClassSchedule/ClassSchedule';
import RoomList from '../containers/RoomList/RoomList';
import SubjectPage from '../containers/SubjectPage/SubjectPage';
import SemesterPage from '../containers/SemesterPage/SemesterPage';
import MergeRolePage from '../containers/MergeRolePage/MergeRolePage';
import ChangePasswordForm from '../components/ChangePasswordForm/ChangePasswordForm';
import GroupSchedulePage from '../components/GroupSchedulePage/GroupSchedulePage';
import { Register } from '../components/Register/Register';
import { ResetPassword } from '../components/ResetPassword/ResetPassword';
import { Login } from '../components/Login/Login';
const Routers = props => {
    const userRole = props.userRole;

    let routes = (
        <Switch>
            <Route path={links.Registration} component={Register}/>
            <Route path={links.RESET_PASSWORD} component={ResetPassword}/>

            <Route path={links.HOME_PAGE} exact component={HomePage} />

            <Route path={links.SCHEDULE_PAGE}>
                <Redirect to={links.LOGIN} />
            </Route>
            <Route path={links.ADMIN_PAGE}>
                <Redirect to={links.LOGIN} />
            </Route>
            <Route path={links.LOGIN} component={Login} />
            <Route path={links.ACTIVATION_PAGE} component={ActivationPage} />
            <Route path={links.MY_PROFILE} component={ProfilePage} />
            <Route path={links.ScheduleFor} component={GroupSchedulePage}/>
        </Switch>
    );

    if (userRole === userRoles.MANAGER) {
        routes = (
            <Switch>
                <Route path={links.Registration} component={Register}/>
                <Route path={links.RESET_PASSWORD} component={ResetPassword}/>
                <Route path={links.HOME_PAGE} exact component={HomePage} />

                <Route path={links.LessonPage}  component={AdminPage} />
                <Route path={links.TeacherList}  component={TeacherList} />
                <Route path={links.GroupList}  component={GroupList} />
                <Route path={links.ClassScheduleTitle}  component={ClassSchedule} />
                <Route path={links.RoomList}  component={RoomList} />
                <Route path={links.SubjectPage}  component={SubjectPage} />
                <Route path={links.BusyRooms}  component={BusyRooms} />
                <Route path={links.SemesterPage}  component={SemesterPage} />
                <Route path={links.MergeRolePage}  component={MergeRolePage} />
                <Route path={links.Changes}  component={ChangePasswordForm} />
                <Route path={links.SCHEDULE_PAGE} component={SchedulePage} />

                <Route path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.ADMIN_PAGE} />
                </Route>
                <Route path={links.LOGIN} component={Login} />

                <Route path={links.ADMIN_PAGE} component={AdminPage} />
                <Route path={links.LOGOUT} component={Logout} />
                <Route path={links.MY_PROFILE} component={ProfilePage} />
                <Route path={links.ScheduleFor} component={GroupSchedulePage}/>

            </Switch>
        );
    } else if (userRole) {
        routes = (
            <Switch>
                <Route path={links.Registration} component={Register}/>
                <Route path={links.RESET_PASSWORD} component={ResetPassword}/>
                <Route path={links.HOME_PAGE} exact component={HomePage} />


                <Route
                    path={links.TEACHER_SCHEDULE}
                    component={TeacherSchedule}
                />
                <Route path={links.SCHEDULE_PAGE}>
                    <Redirect to={links.LOGIN} />
                </Route>
                <Route path={links.ADMIN_PAGE}>
                    <Redirect to={links.LOGIN} />
                </Route>
                <Route path={links.LOGIN} component={Login} />
                <Route path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.HOME_PAGE} />
                </Route>
                <Route path={links.MY_PROFILE} component={ProfilePage} />
                <Route path={links.LOGOUT} component={Logout} />
                <Route path={links.ScheduleFor} component={GroupSchedulePage}/>
            </Switch>
        );
    }
    return (
        <Router>
            <Header userRole={userRole} roles={userRoles} />
            {routes}
        </Router>
    );
};

const mapStateToProps = state => ({ userRole: state.auth.role });

export default connect(mapStateToProps)(Routers);
