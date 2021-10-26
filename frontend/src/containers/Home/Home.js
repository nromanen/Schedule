import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

import { getPublicClassScheduleListService } from '../../services/classService';
import { HOME_TITLE } from '../../constants/translationLabels/common';
import {
    getDefaultSemesterRequsted,
    setScheduleSemesterId,
    setScheduleType,
} from '../../actions/schedule';

const HomePage = (props) => {
    const { getDefaultSemester, setSemesterId, setTypeOfSchedule } = props;
    const { t } = useTranslation('common');

    useEffect(() => getPublicClassScheduleListService(), []);
    setSemesterId(null);
    setTypeOfSchedule('');

    useEffect(() => {
        getDefaultSemester();
        setTypeOfSchedule('');
    }, []);

    return (
        <Fragment>
            <h1>{t(HOME_TITLE)}</h1>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

const mapDispatchToProps = (dispatch) => ({
    getDefaultSemester: () => dispatch(getDefaultSemesterRequsted()),
    setSemesterId: (id) => dispatch(setScheduleSemesterId(id)),
    setTypeOfSchedule: (type) => dispatch(setScheduleType(type)),
});

export default connect(null, mapDispatchToProps)(HomePage);
