import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { userRoles } from '../../constants/userRoles';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

import { getPublicClassScheduleListService } from '../../services/classService';
import { getMyTeacherWishesService } from '../../services/teacherWishService';
import {
    disableDefaultSemesterService,
    getDefaultSemesterService,
    getFullSchedule,
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    setScheduleTypeService,
    showAllPublicGroupsService,
    showAllPublicSemestersService,
    showAllPublicTeachersService
} from '../../services/scheduleService';
import { Redirect, useHistory } from 'react-router-dom';
import { setScheduleType } from '../../redux/actions';
import { showAllSemestersService } from '../../services/semesterService';
const HomePage = props => {
    const { t } = useTranslation('common');
    useEffect(() => getPublicClassScheduleListService(), []);
    setScheduleSemesterIdService(null)
    setScheduleTypeService("")

    // useEffect(() => showAllPublicSemestersService(), []);
    useEffect(() => {
        if (props.userRole === userRoles.TEACHER) {
            //getMyTeacherWishesService();
        }
    }, []);
    useEffect(() => {
        if (props.userRole === null) {
            console.log("some user")
            //disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService("");
        }
    }, []);
    useEffect(() => {
        if (props.userRole === userRoles.TEACHER) {
            console.log("Teacher")
            //disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService("");
        }
    }, []);
    useEffect(() => {
        console.log("MANAGER")
        if (props.userRole === userRoles.MANAGER) {
           // disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService("");
        }
    }, []);

    return (

        <Fragment>
            <h1>{t('home_title')}</h1>
            <GroupSchedulePage scheduleType="default"  />
        </Fragment>
    );
};

const mapStateToProps = state => ({
    userRole: state.auth.role ,
});

export default connect(mapStateToProps)(HomePage);
