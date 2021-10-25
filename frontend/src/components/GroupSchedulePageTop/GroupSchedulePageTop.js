import React from 'react';

import { useTranslation } from 'react-i18next';

import './GroupSchedulePageTop.scss';
import Card from '../../share/Card/Card';

import {
    GREETING_SCHEDULE_MESSAGE,
    GREETING_SCHEDULE_MESSAGE_HINT,
} from '../../constants/translationLabels/common';
import SelectPlace from './SelectPlace';
import SchedulePageForm from '../../containers/GroupSchedulePageTop/GroupScheduleForm';

const GroupSchedulePageTop = (props) => {
    const { t } = useTranslation('common');
    const { handleSubmit, changePlace, place } = props;

    return (
        <section className="schedule_page-container">
            <p>{t(GREETING_SCHEDULE_MESSAGE)}</p>
            <p>{t(GREETING_SCHEDULE_MESSAGE_HINT)}</p>
            <section className="form-buttons-container top">
                <Card additionClassName="form-card width-auto">
                    <SchedulePageForm onSubmit={handleSubmit} />
                </Card>
                <SelectPlace place={place} changePlace={changePlace} />
            </section>
        </section>
    );
};

export default GroupSchedulePageTop;
