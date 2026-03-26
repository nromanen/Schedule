import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import HomePage from '../../containers/Home/Home';
import { SCHEDULE_FOR_LINK } from '../../constants/links';

function TeacherRoute({ component: Component, userRole, teacher, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (userRole === 'ROLE_MANAGER') {
                    return <Component {...props} />;
                }
                if (userRole === 'ROLE_TEACHER') {
                    const urlTeacherId = new URLSearchParams(props.location.search).get('teacher');
                    if (!urlTeacherId || urlTeacherId === String(teacher?.id)) {
                        return <Component {...props} />;
                    }
                    return <Redirect to={`${SCHEDULE_FOR_LINK}?teacher=${teacher?.id}`} />;
                }
                return <HomePage />;
            }}
        />
    );
}

const mapStateToProps = (state) => ({
    userRole: state.auth.role,
    teacher: state.teachers.teacher,
});

export default connect(mapStateToProps)(TeacherRoute);