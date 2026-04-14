import React from 'react';
import {Router, Redirect, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import history from '../helper/history';

import Header from '../components/Header/Header';

import HomePage from '../containers/Home/Home';
import TeacherSchedule from '../components/TeacherSchedule/TeacherSchedule';
import Logout from '../containers/Auth/Logout';
import ActivationPage from '../containers/ActivationPage/ActivationPage';
import ProfilePage from '../containers/ProfilePage/ProfilePage';
import EditCurrentSchedulePage from '../containers/EditCurrentSchedule/EditCurrentSchedulePage';
import {
    ACTIVATION_PAGE_LINK,
    ADMIN_PAGE_LINK,
    HOME_PAGE_LINK,
    LOGIN_LINK,
    LOGOUT_LINK,
    MY_PROFILE_LINK,
    REGISTRATION_LINK,
    RESET_PASSWORD_LINK,
    SCHEDULE_FOR_LINK,
    SCHEDULE_PAGE_LINK,
    TEACHER_SCHEDULE_LINK,
    SET_PASSWORD_LINK
} from '../constants/links';
import SetPasswordForm from '../components/SetPasswordForm/SetPasswordForm';
import {userRoles} from '../constants/userRoles';
import GroupSchedulePage from '../containers/GroupSchedulePage/GroupSchedulePage';
import {Register} from '../components/Register/Register';
import {ResetPassword} from '../components/ResetPassword/ResetPassword';
import {Login} from '../components/Login/Login';
import MyLessonsPage from '../components/MyLessonsPage/MyLessonsPage';
import { MY_LESSONS_LINK } from '../constants/links';
import {AdminRoute, UserRoute, TeacherRoute} from './routes';
import AdminRouter from './AdminRouter';

const Routers = (props) => {
    const { userRole } = props;
    return (
        <Router history={history} basename={process.env.REACT_APP_BASE_PATH || "/"}>
            <Header userRole={userRole} roles={userRoles} />
            <Switch>
                <Route exact path={HOME_PAGE_LINK} component={HomePage} />
                <TeacherRoute path={SCHEDULE_FOR_LINK} component={GroupSchedulePage} />
                <Route path={ACTIVATION_PAGE_LINK} component={ActivationPage} />
                <Route path={SET_PASSWORD_LINK} component={SetPasswordForm} />
                <Route path={RESET_PASSWORD_LINK} component={ResetPassword} />
                <Route path={REGISTRATION_LINK} component={Register} />
                <Route path={LOGIN_LINK} component={Login} />
                <UserRoute path={TEACHER_SCHEDULE_LINK} component={TeacherSchedule} />
                <UserRoute path={MY_LESSONS_LINK} component={MyLessonsPage} />
                <UserRoute path={MY_PROFILE_LINK} component={ProfilePage} />
                <UserRoute path={LOGOUT_LINK} component={Logout} />
                <AdminRoute path={SCHEDULE_PAGE_LINK} component={EditCurrentSchedulePage} />
                <AdminRoute path={ADMIN_PAGE_LINK} component={AdminRouter} />
                <UserRoute path={ACTIVATION_PAGE_LINK}>
                    <Redirect to={HOME_PAGE_LINK} />
                </UserRoute>
                <UserRoute path={SCHEDULE_PAGE_LINK}>
                    <Redirect to={LOGIN_LINK} />
                </UserRoute>
            </Switch>
        </Router>
    );
};

const mapStateToProps = (state) => ({ userRole: state.auth.role });

export default connect(mapStateToProps)(Routers);
