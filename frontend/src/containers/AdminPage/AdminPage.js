import React from 'react';
import { connect } from 'react-redux';
import NavigationPage from '../../components/Navigation/NavigationPage';
import LessonPage from '../LessonPage/LessonPage';
import { navigation, navigationNames } from '../../constants/navigation';

function AdminPage(props) {
    return (
        <>
            <NavigationPage val={navigation.LESSONS} />
            <LessonPage />
        </>
    );
}
const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(AdminPage);
