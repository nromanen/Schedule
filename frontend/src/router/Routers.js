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
                <Route exact links={links.HOME_PAGE} component={HomePage} />
                <Route links={links.SCHEDULE_FOR} component={GroupSchedulePage} />
                <Route links={links.ACTIVATION_PAGE} component={ActivationPage} />
                <Route links={links.RESET_PASSWORD} component={ResetPassword} />
                <Route links={links.REGISTRATION} component={Register} />
                <Route links={links.LOGIN} component={Login} />
                <UserRoute links={links.TEACHER_SCHEDULE} component={TeacherSchedule} />
                <UserRoute links={links.MY_PROFILE} component={ProfilePage} />
                <UserRoute links={links.LOGOUT} component={Logout} />
                <AdminRoute links={links.SCHEDULE_PAGE} component={SchedulePage} />
                <AdminRoute links={links.ADMIN_PAGE} component={AdminRouter} />
                <UserRoute links={links.ACTIVATION_PAGE}>
                    <Redirect to={links.HOME_PAGE} />
                </UserRoute>
                <UserRoute links={links.SCHEDULE_PAGE}>
                    <Redirect to={links.LOGIN} />
                </UserRoute>
            </Switch>
        </Router>
    );
};

const mapStateToProps = (state) => ({ userRole: state.auth.role });

export default connect(mapStateToProps)(Routers);
