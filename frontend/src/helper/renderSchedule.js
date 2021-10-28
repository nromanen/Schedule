import React from 'react';
import { isEmpty } from 'lodash';
import i18n from '../i18n';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import { renderGroupTable, renderFullSchedule, renderWeekTable } from './renderScheduleTable';
import { getGroupScheduleTitle, getTeacherScheduleTitle } from '../utils/titlesUtil';

const emptySchedule = () => <p className="empty_schedule">{i18n.t('common:empty_schedule')}</p>;

const renderSchedule = (
    { scheduleType, groupSchedule, fullSchedule, teacherSchedule, groupId, teacherId, semesterId },
    place,
) => {
    switch (scheduleType) {
        case 'group': {
            const { semester, group, oddArray, evenArray } = groupSchedule;

            if (isEmpty(oddArray) || isEmpty(evenArray)) return emptySchedule();

            return (
                <>
                    <h1>
                        {getGroupScheduleTitle(semester, group)}
                        <DownloadLink entity="group" semesterId={semesterId} entityId={groupId} />
                    </h1>
                    <h2>{i18n.t('common:odd_week')}</h2>
                    {renderGroupTable(oddArray, 1, semester, place)}
                    <h2>{i18n.t('common:even_week')}</h2>
                    {renderGroupTable(evenArray, 0, semester, place)}
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
                            semesterId={semesterId}
                            entityId={teacherId}
                        />
                    </h1>
                    <h2>{i18n.t('common:odd_week')}</h2>
                    {renderWeekTable(odd, place)}
                    <h2>{i18n.t('common:even_week')}</h2>
                    {renderWeekTable(even, place)}
                </>
            );
        }
        case 'full': {
            const { resultArray } = fullSchedule;
            if (isEmpty(resultArray)) {
                return emptySchedule();
            }
            return renderFullSchedule(fullSchedule, place);
        }
        default:
            return null;
    }
};

export { renderSchedule };
