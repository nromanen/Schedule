import React from 'react';
import {isEmpty} from 'lodash';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import {renderFullSchedule, renderGroupTable, renderWeekTable} from './renderScheduleTable';
import {getGroupScheduleTitle, getTeacherScheduleTitle} from '../utils/titlesUtil';
import {week_types} from "../constants/week_types";

const emptySchedule = (t) => <p className="empty_schedule">{t('common:empty_schedule')}</p>;

const renderSchedule = (props) => {
    const {
        scheduleType,
        groupSchedule,
        fullSchedule,
        teacherSchedule,
        groupData,
        teacherData,
        semesterData,
        t,
        week_type,
    } = props;

    switch (scheduleType) {
        case 'group': {
            const { semester, group, oddArray, evenArray } = groupSchedule;
            if (isEmpty(oddArray) || isEmpty(evenArray)) return emptySchedule(t);
            return (
                <>
                    <h1>
                        {getGroupScheduleTitle(semester, group)}
                        <DownloadLink
                            entity="group"
                            semesterId={semesterData.id}
                            entityId={groupData.id}
                        />
                    </h1>

                    {(week_type===week_types.ODD||week_type===week_types.EVEN_ODD)&&<>
                        <h2>{t('common:odd_week')}</h2>
                        {renderGroupTable(oddArray, true, semester)}
                    </>}
                    {(week_type===week_types.EVEN||week_type===week_types.EVEN_ODD)&&<>
                        <h2>{t('common:even_week')}</h2>
                        {renderGroupTable(evenArray, true, semester)}
                    </>}
                </>
            );
        }
        case 'teacher': {
            const { semester, teacher, odd, even } = teacherSchedule;
            if (isEmpty(odd?.classes) || isEmpty(even?.classes)) return emptySchedule(t);

            return (
                <>
                    <h1>
                        {getTeacherScheduleTitle(semester, teacher)}
                        <DownloadLink
                            entity="teacher"
                            semesterId={semesterData.id}
                            entityId={teacherData.id}
                        />
                    </h1>
                    {(week_type===week_types.ODD||week_type===week_types.EVEN_ODD)&&<>
                        <h2>{t('common:odd_week')}</h2>
                        {renderWeekTable(odd)}
                    </>}
                    {(week_type===week_types.EVEN||week_type===week_types.EVEN_ODD)&&<>
                        <h2>{t('common:even_week')}</h2>
                        {renderWeekTable(even)}
                    </>}
                </>
            );
        }
        case 'full': {
            const { resultArray } = fullSchedule;
            if (isEmpty(resultArray)) {
                return emptySchedule(t);
            }
            return renderFullSchedule(fullSchedule);
        }
        default:
            return null;
    }
};

export { renderSchedule };
