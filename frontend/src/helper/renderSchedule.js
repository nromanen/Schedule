import React from 'react';
import { isEmpty } from 'lodash';
import i18n from '../i18n';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import { renderGroupTable, renderFullSchedule, renderWeekTable } from './renderScheduleTable';
import { getGroupScheduleTitle, getTeacherScheduleTitle } from '../utils/titlesUtil';

const emptySchedule = () => <p className="empty_schedule">{i18n.t('common:empty_schedule')}</p>;

const renderSchedule = (props) => {
    const {
        scheduleType,
        groupSchedule,
        fullSchedule,
        teacherSchedule,
        groupData,
        teacherData,
        semesterData,
    } = props;
    switch (scheduleType) {
        case 'group': {
            const { semester, group, oddArray, evenArray } = groupSchedule;

            if (isEmpty(oddArray) || isEmpty(evenArray)) return emptySchedule();
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
                    <h2>{i18n.t('common:odd_week')}</h2>
                    {renderGroupTable(oddArray, true, semester)}
                    <h2>{i18n.t('common:even_week')}</h2>
                    {renderGroupTable(evenArray, false, semester)}
                </>
            );
        }
        case 'teacher': {
            const { semester, teacher, odd, even } = teacherSchedule;

            if (isEmpty(odd) || isEmpty(even)) return emptySchedule();

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
                    <h2>{i18n.t('common:odd_week')}</h2>
                    {renderWeekTable(odd)}
                    <h2>{i18n.t('common:even_week')}</h2>
                    {renderWeekTable(even)}
                </>
            );
        }
        case 'full': {
            const { resultArray } = fullSchedule;
            if (isEmpty(resultArray)) {
                return emptySchedule();
            }
            return renderFullSchedule(fullSchedule);
        }
        default:
            return null;
    }
};

export { renderSchedule };
