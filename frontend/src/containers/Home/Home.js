import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import GroupSchedulePage from '../GroupSchedulePage/GroupSchedulePage';

import { getPublicClassScheduleListService } from '../../services/classService';
import { HOME_TITLE } from '../../constants/translationLabels/common';

const HomePage = () => {
    const { t } = useTranslation('common');

    useEffect(() => getPublicClassScheduleListService(), []);

    return (
        <Fragment>
            <h1>{t(HOME_TITLE)}</h1>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

export default HomePage;
