import React, {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import GroupSchedulePage from '../GroupSchedulePage/GroupSchedulePage';

import {HOME_TITLE} from '../../constants/translationLabels/common';

const HomePage = (props) => {
    const { t } = useTranslation('common');

    useEffect(() => {
        document.title = t(HOME_TITLE);
    }, [t]);

    return (
        <Fragment>
            <GroupSchedulePage scheduleType="default" />
        </Fragment>
    );
};

export default HomePage;

