import React from 'react';
import i18n from '../i18n';
import { setLoadingService } from '../services/loadingService';
import { isNotReadySchedule } from '../utils/sheduleUtils';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import { makeFullSchedule, makeTeacherSchedule } from './prepareSchedule';
import { renderGroupTable, renderFullSchedule, renderWeekTable } from './renderScheduleTable';
import { getGroupScheduleTitle, getTeacherScheduleTitle } from '../utils/titlesUtil';

const emptySchedule = () => <p className="empty_schedule">{i18n.t('common:empty_schedule')}</p>;

const renderSchedule = (
    {
        scheduleType,
        groupSchedule,
        fullSchedule,
        teacherSchedule,
        groupId,
        teacherId,
        semesterId,
        loading,
    },
    place,
) => {
    switch (scheduleType) {
        case 'group': {
            const { semester, group, oddArray, evenArray } = groupSchedule;

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
            if (!teacherSchedule || !teacherSchedule.days || teacherSchedule.days.length === 0) {
                return emptySchedule();
            }
            const { semester, teacher, odd, even } = makeTeacherSchedule(teacherSchedule);

            setLoadingService(false);
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
                    {renderWeekTable(odd, 1, place)}
                    <h2>{i18n.t('common:even_week')}</h2>
                    {renderWeekTable(even, 0, place)}
                </>
            );
        }
        case 'full': {
            if (isNotReadySchedule(fullSchedule.schedule, loading)) {
                return emptySchedule();
            }
            const result = makeFullSchedule(fullSchedule);

            setLoadingService(false);
            if (result.groupsCount) {
                return renderFullSchedule(result, place);
            }
            break;
        }
        default:
            return null;
    }
    return null;
};

export { renderSchedule };
