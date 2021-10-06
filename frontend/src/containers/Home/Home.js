import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Redirect, useHistory } from 'react-router-dom';
import { userRoles } from '../../constants/userRoles';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

import {
    getDefaultSemesterService,
    setScheduleSemesterIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';
import { getPublicClassScheduleListService } from '../../services/classService';

const HomePage = (props) => {
    const { t } = useTranslation('common');

    useEffect(() => getPublicClassScheduleListService(), []);
    setScheduleSemesterIdService(null);
    setScheduleTypeService('');

    // useEffect(() => showAllPublicSemestersService(), []);
    useEffect(() => {
        if (props.userRole === null) {
            // disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService('');
        }
    }, []);
    useEffect(() => {
        if (props.userRole === userRoles.TEACHER) {
            // disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService('');
        }
    }, []);
    useEffect(() => {
        if (props.userRole === userRoles.MANAGER) {
            // disableDefaultSemesterService();
            getDefaultSemesterService();
            setScheduleTypeService('');
        }
    }, []);

    return (
        <Fragment>
            <h1>{t('home_title')}</h1>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

const mapStateToProps = (state) => ({
    userRole: state.auth.role,
});

export default connect(mapStateToProps)(HomePage);
