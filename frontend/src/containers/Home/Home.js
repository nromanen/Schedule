import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';

import {
    setScheduleSemesterIdService,
    setScheduleTypeService,
} from '../../services/scheduleService';
import { getPublicClassScheduleListService } from '../../services/classService';
import { HOME_TITLE } from '../../constants/translationLabels/common';
import { getDefaultSemesterRequsted } from '../../actions/schedule';

const HomePage = (props) => {
    const { getDefaultSemester } = props;
    const { t } = useTranslation('common');

    useEffect(() => getPublicClassScheduleListService(), []);
    setScheduleSemesterIdService(null);
    setScheduleTypeService('');

    useEffect(() => {
        getDefaultSemester();
        setScheduleTypeService('');
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
});

export default connect({}, mapDispatchToProps)(HomePage);
