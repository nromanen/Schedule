import React from 'react';
import { connect } from 'react-redux';
import NavigationPage from '../../components/Navigation/NavigationPage';
import LessonPage from '../LessonPage/LessonPage';
import { navigation } from '../../constants/navigation';

function AdminPage() {
    return (
        <>
            {/* <NavigationPage val={navigation.LESSONS} /> */}
            <LessonPage />
        </>
    );
}
const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(AdminPage);
