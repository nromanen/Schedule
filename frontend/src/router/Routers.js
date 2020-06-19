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
import Auth from '../containers/Auth/Auth';
import SchedulePage from '../containers/SchedulePage/SchedulePage';
import AdminPage from '../containers/AdminPage/AdminPage';
import Logout from '../containers/Auth/Logout/Logout';
import ActivationPage from '../containers/ActivationPage/ActivationPage';
import ProfilePage from '../containers/ProfilePage/ProfilePage';
import { links } from '../constants/links';
import { userRoles } from '../constants/userRoles';

const Routers = props => {
    const userRole = props.userRole;

    let routes = (
        <Switch>
            <Route path={links.HOME_PAGE} exact component={HomePage} />
            <Route path={links.SCHEDULE_PAGE}>
                <Redirect to={links.AUTH} />
            </Route>
            <Route path={links.ADMIN_PAGE}>
                <Redirect to={links.AUTH} />
            </Route>
            <Route path={links.AUTH} component={Auth} />
            <Route path={links.ACTIVATION_PAGE} component={ActivationPage} />
            <Route path={links.MY_PROFILE} component={ProfilePage} />
        </Switch>
    );

    if (userRole === userRoles.MANAGER) {
        routes = (
            <Switch>
                <Route path={links.HOME_PAGE} exact component={HomePage} />
                <Route path={links.SCHEDULE_PAGE} component={SchedulePage} />
                <Route path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.ADMIN_PAGE} />
                </Route>
                <Route path={links.AUTH} component={Auth} />

                <Route path={links.ADMIN_PAGE} component={AdminPage} />
                <Route path={links.LOGOUT} component={Logout} />
                <Route path={links.MY_PROFILE} component={ProfilePage} />
            </Switch>
        );
    } else if (userRole) {
        routes = (
            <Switch>
                <Route path={links.HOME_PAGE} exact component={HomePage} />
                <Route
                    path={links.TEACHER_SCHEDULE}
                    component={TeacherSchedule}
                />
                <Route path={links.SCHEDULE_PAGE}>
                    <Redirect to={links.AUTH} />
                </Route>
                <Route path={links.ADMIN_PAGE}>
                    <Redirect to={links.AUTH} />
                </Route>
                <Route path={links.AUTH} component={Auth} />
                <Route path={links.ACTIVATION_PAGE}>
                    <Redirect to={links.HOME_PAGE} />
                </Route>
                <Route path={links.MY_PROFILE} component={ProfilePage} />
                <Route path={links.LOGOUT} component={Logout} />
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
