import React from 'react';

import {useTranslation} from 'react-i18next';

import './GroupSchedulePageTop.scss';
import Card from '../../../share/Card/Card';

import {GREETING_SCHEDULE_MESSAGE, GREETING_SCHEDULE_MESSAGE_HINT,} from '../../../constants/translationLabels/common';
import SelectPlace from '../../../containers/GroupSchedulePage/SelectPlace';
import SelectWeekType from '../../../containers/GroupSchedulePage/SelectWeekType';
import SchedulePageForm from '../../../containers/GroupSchedulePage/SchedulePageForm';
import {useSelector} from "react-redux";

const GroupSchedulePageTop = (props) => {
    const {t} = useTranslation('common');
    const {handleSubmit} = props;
    const {scheduleGroup: group, scheduleTeacher: teacher} = useSelector((state) => state.schedule);

    return (
        <section className="schedule_page-container">
            <p>{t(GREETING_SCHEDULE_MESSAGE)}</p>
            <p>{t(GREETING_SCHEDULE_MESSAGE_HINT)}</p>
            <section className="schedule-form-buttons-container">
                <Card additionClassName="form-card schedule-form-card">
                    <SchedulePageForm onSubmit={handleSubmit}/>
                </Card>
                {(group || teacher) && <SelectWeekType/>}
                <SelectPlace/>
            </section>
        </section>
    );
};

export default GroupSchedulePageTop;
