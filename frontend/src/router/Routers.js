import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../components/Header/Header';

import HomePage from '../containers/Home/Home';
import TeacherSchedule from '../components/TeacherSchedule/TeacherSchedule';
import Logout from '../containers/Auth/Logout/Logout';
import ActivationPage from '../containers/ActivationPage/ActivationPage';
import ProfilePage from '../containers/ProfilePage/ProfilePage';
import SchedulePage from '../containers/SchedulePage/SchedulePage';
import { links } from '../constants/links';
import { userRoles } from '../constants/userRoles';
import GroupSchedulePage from '../components/GroupSchedulePage/GroupSchedulePage';
import { Register } from '../components/Register/Register';
import { ResetPassword } from '../components/ResetPassword/ResetPassword';
import { Login } from '../components/Login/Login';
import { AdminRoute, UserRoute } from './routes';
import AdminRouter from './AdminRouter';

const Routers = (props) => {
    const { userRole } = props;
    return (
        <Router>
            <Header userRole={userRole} roles={userRoles} />
            <Switch>
                <Route exact path={links.HOME_PAGE} component={HomePage} />
                <Route path={links.ScheduleFor} component={GroupSchedulePage} />
                <Route path={links.ACTIVATION_PAGE} component={ActivationPage} />
                <Route path={links.Registration} component={Register} />
                <Route path={links.LOGIN} component={Login} />
                <UserRoute path={links.TEACHER_SCHEDULE} component={TeacherSchedule} />
                <UserRoute path={links.RESET_PASSWORD} component={ResetPassword} />
                <UserRoute path={links.MY_PROFILE} component={ProfilePage} />
                <UserRoute path={links.LOGOUT} component={Logout} />
                <AdminRoute path={links.SCHEDULE_PAGE} component={SchedulePage} />
                <AdminRoute path={links.ADMIN_PAGE} component={AdminRouter} />
                <UserRoute path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.HOME_PAGE} />
                </UserRoute>
                <UserRoute path={links.SCHEDULE_PAGE}>
                    <Redirect to={links.LOGIN} />
                </UserRoute>
            </Switch>
        </Router>
    );
};

const mapStateToProps = (state) => ({ userRole: state.auth.role });

export default connect(mapStateToProps)(Routers);
