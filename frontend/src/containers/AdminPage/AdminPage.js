import React from 'react';
import { connect } from 'react-redux';
import LessonPage from '../LessonPage/LessonPage';

function AdminPage() {
    return <LessonPage />;
}
const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(AdminPage);
