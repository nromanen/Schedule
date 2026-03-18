import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import GroupSchedulePage from '../GroupSchedulePage/GroupSchedulePage';

import {HOME_TITLE} from '../../constants/translationLabels/common';

const HomePage = (props) => {
    const { getPublicClassScheduleList } = props;
    const { t } = useTranslation('common');

    return (
        <Fragment>
            <h1>{t(HOME_TITLE)}</h1>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

export default HomePage;

