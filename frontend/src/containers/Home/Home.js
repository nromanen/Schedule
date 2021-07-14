import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { userRoles } from '../../constants/userRoles';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

import { getPublicClassScheduleListService } from '../../services/classService';
import { getMyTeacherWishesService } from '../../services/teacherWishService';
import { clearSemesterService } from '../../services/semesterService';
import { setScheduleSemesterIdService } from '../../services/scheduleService';

const HomePage = props => {
    const { t } = useTranslation('common');

    useEffect(() => getPublicClassScheduleListService(), []);
    useEffect(()=>setScheduleSemesterIdService(null))
    useEffect(() => {
        if (props.userRole === userRoles.TEACHER) {
            getMyTeacherWishesService();
        }
    }, []);

    return (
        <Fragment>
            <h1>{t('home_title')}</h1>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

const mapStateToProps = state => ({ userRole: state.auth.role });

export default connect(mapStateToProps)(HomePage);
