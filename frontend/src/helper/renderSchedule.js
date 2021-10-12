import React from 'react';
import i18n from '../i18n';
import { setLoadingService } from '../services/loadingService';
import { isNotReadySchedule } from '../utils/sheduleUtils';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import { makeGroupSchedule, makeFullSchedule, makeTeacherSchedule } from './prepareSchedule';
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
            if (isNotReadySchedule(groupSchedule.schedule, loading)) {
                return emptySchedule();
            }

            const { done, semester, group, oddArray, evenArray } = makeGroupSchedule(groupSchedule);

            setLoadingService(false);

            if (done) {
                return (
                    <>
                        <h1>
                            {getGroupScheduleTitle(semester, group)}
                            <DownloadLink
                                entity="group"
                                semesterId={semesterId}
                                entityId={groupId}
                            />
                        </h1>
                        <h2>{i18n.t('common:odd_week')}</h2>
                        {renderGroupTable(oddArray, 1, semester, place)}
                        <h2>{i18n.t('common:even_week')}</h2>
                        {renderGroupTable(evenArray, 0, semester, place)}
                    </>
                );
            }

            break;
        }
        case 'teacher': {
            if (isNotReadySchedule(teacherSchedule.days, loading)) {
                return emptySchedule();
            }

            const { done, semester, teacher, odd, even } = makeTeacherSchedule(teacherSchedule);

            setLoadingService(false);

            if (done) {
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
            break;
        }
        case 'full': {
            if (isNotReadySchedule(fullSchedule.schedule, loading)) {
                return emptySchedule();
            }
            const result = makeFullSchedule(fullSchedule);

            setLoadingService(false);
            if (result.groupsCount || result.done) {
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
