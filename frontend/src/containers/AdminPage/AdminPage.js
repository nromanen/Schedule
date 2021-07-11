import React from 'react';
import NavigationPage from '../../components/Navigation/NavigationPage';
import LessonPage from '../LessonPage/LessonPage';
import { navigation } from '../../constants/navigationOrder';
import { connect } from 'react-redux';



function AdminPage(props){
    return(

        <>
            <NavigationPage val={navigation.LESSONS} />
            <LessonPage/>
        </>
    )
}
const mapStateToProps = state => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne
});

export default connect(mapStateToProps, {})(AdminPage);