import React from 'react';
import {isEmpty} from 'lodash';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import {renderFullSchedule, renderGroupTable, renderWeekTable, ScheduleLegend} from './renderScheduleTable';
import DepartmentSchedule from '../components/DepartmentSchedule/DepartmentSchedule';
import {getGroupScheduleTitle, getTeacherScheduleTitle, getDepartmentScheduleTitle} from '../utils/titlesUtil';
import SchedulePublishBanner from "../components/GroupSchedulePage/SchedulePublishBanner/SchedulePublishBanner";
import DepartmentDownloadLink from '../components/DownloadLink/DepartmentDownloadLink';

import { daysUppercase } from '../constants/schedule/days';
import { matchDayNumberSysytemToDayName } from './renderScheduleTable';
import CalendarSchedule, {isShortSemester} from "../components/CalendarSchedule/CalendarSchedule";
import CalendarGroupSchedule from "../components/CalendarSchedule/CalendarGroupSchedule";


const emptySchedule = (t) => <p className="empty_schedule">{t('common:empty_schedule')}</p>;

export const ViewModeToggle = ({ viewMode, setViewMode, t }) => {
    return (
        <div className="schedule-view-toggle">
            <button
                className={`schedule-view-toggle__btn ${viewMode === 'today' ? 'active' : ''}`}
                onClick={() => setViewMode('today')}
            >
                {t('common:today_schedule', 'Сьогодні')}
            </button>
            <button
                className={`schedule-view-toggle__btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => setViewMode('all')}
            >
                {t('common:full_week_schedule', 'Весь тиждень')}
            </button>
        </div>
    );
};

const renderSchedule = (props) => {
    const {
        scheduleType,
        groupSchedule,
        fullSchedule,
        teacherSchedule,
        groupData,
        teacherData,
        semesterData,
        departmentData,
        notPublished,
        notPublishedMessage,
        isManager,
        t,
        viewMode,
        setViewMode,
    } = props;

    if (notPublished) {
        return (
            <div className="schedule-not-published">
                <h2>{notPublishedMessage || t('common:schedule_not_published')}</h2>
            </div>
        );
    }

    const titleSuffix = isManager ? (
        <div className="schedule-publish-banner-right">
            <SchedulePublishBanner />
        </div>
    ) : null;

    switch (scheduleType) {
        case 'group': {
            const {semester, group, oddArray, evenArray} = groupSchedule;
            if (isEmpty(oddArray) && isEmpty(evenArray)) return emptySchedule(t);

            // Short semester → calendar view
            if (isShortSemester(semester.startDay, semester.endDay)) {
                return (
                    <>
                        {titleSuffix}
                        <h1>
                            {getGroupScheduleTitle(semester, group)}
                            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />
                            {groupData?.id && (
                                <DownloadLink entity="group" semesterId={semesterData.id} entityId={groupData.id} />
                            )}

                        </h1>
                        <ScheduleLegend />
                        <CalendarGroupSchedule groupSchedule={groupSchedule} viewMode={viewMode} t={t} />
                    </>
                );
            }

            // Regular semester
            return (
                <>
                    {titleSuffix}
                    <h1>
                        {getGroupScheduleTitle(semester, group)}
                        <DownloadLink
                            entity="group"
                            semesterId={semesterData.id}
                            entityId={groupData.id}
                        />
                    </h1>
                    <h2>
                <span className={getWeekParity(semester.startDay) % 2 === 1 ? "currentDay" : ""}>
                    {t('common:odd_week')}</span>
                    </h2>
                    {renderGroupTable(oddArray, true, semester)}
                    <h2>
                <span className={getWeekParity(semester.startDay) % 2 === 0 ? "currentDay" : ""}>
                    {t('common:even_week')}</span>
                    </h2>
                    {renderGroupTable(evenArray, false, semester)}
                </>
            );
        }
        case 'teacher': {
            const {semester, teacher, odd, even} = teacherSchedule;
            if (isEmpty(odd?.classes) && isEmpty(even?.classes)) return emptySchedule(t);
            return (
                <>
                    {titleSuffix}
                    <h1>
                        {getTeacherScheduleTitle(semester, teacher)}
                        <DownloadLink
                            entity="teacher"
                            semesterId={semesterData.id}
                            entityId={teacherData.id}
                        />
                    </h1>
                    <ScheduleLegend />
                    <h2>
                <span className={getWeekParity(semester.startDay) % 2 === 1 ? "currentDay" : ""}>
                    {t('common:odd_week')}</span>
                    </h2>
                    {renderWeekTable(odd)}
                    <h2>
                <span className={getWeekParity(semester.startDay) % 2 === 0 ? "currentDay" : ""}>
                    {t('common:even_week')}</span>
                    </h2>
                    {renderWeekTable(even)}
                </>
            );
        }
        case 'department': {
            const { resultArray, semester } = fullSchedule;
            if (isEmpty(resultArray)) return emptySchedule(t);
            return (
                <>
                    {titleSuffix}
                    <h1>
                        {getDepartmentScheduleTitle(semester, departmentData)}
                        <DepartmentDownloadLink
                            departmentName={departmentData?.name}
                            semesterDescription={semester?.description}
                            semesterStartDay={semester?.startDay}
                            semesterEndDay={semester?.endDay}
                        />
                    </h1>
                    <DepartmentSchedule fullSchedule={fullSchedule} departmentId={departmentData?.id} />
                </>
            );
        }
        case 'full': {
            const { resultArray, semester } = fullSchedule;
            if (isEmpty(resultArray)) {
                return emptySchedule(t);
            }

            // Short semester (≤28 days) → calendar view
            if (isShortSemester(semester.startDay, semester.endDay)) {
                const weekNumber = getWeekParity(semester.startDay);
                return (
                    <>
                        {isManager && (
                            <div className="schedule-publish-banner-right">
                                <SchedulePublishBanner />
                            </div>
                        )}
                        <h1>
                            <span className="schedule-week-badge">{weekNumber} {t('week_label')}</span>
                            {semester.description} ({semester.startDay}–{semester.endDay})
                            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />
                        </h1>
                        <ScheduleLegend />
                        <CalendarSchedule fullSchedule={fullSchedule} viewMode={viewMode} t={t} />
                    </>
                );
            }

            // Regular semester
            const currentDay = matchDayNumberSysytemToDayName();
            const currentWeekIsOdd = getWeekParity(semester.startDay) % 2 === 1;

            const displaySchedule = viewMode === 'today'
                ? { ...fullSchedule, resultArray: resultArray.filter(d => d.day === currentDay) }
                : fullSchedule;

            return (
                <>
                    {titleSuffix}
                    {viewMode === 'today' && !currentDay && (
                        <p className="empty_schedule">{t('common:no_classes_today', 'Сьогодні немає занять')}</p>
                    )}
                    {renderFullSchedule(
                        displaySchedule,
                        viewMode === 'today' ? currentWeekIsOdd : null,
                        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />
                    )}
                </>
            );
        }
        default:
            return null;
    }
};

const getWeekParity = (startDate, currentDate = new Date()) => {
    const semesterStart = startDate instanceof Date ? startDate : new Date(transformSemesterDate(startDate));
    const targetDate = currentDate instanceof Date ? currentDate : new Date(transformSemesterDate(currentDate));

    semesterStart.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < semesterStart) return 0;

    // Get the day of the week for the semester start (0 = Sunday, 6 = Saturday)
    const startDay = semesterStart.getDay();

    // Find the first week boundary after semester start
    const firstWeekBoundary = new Date(semesterStart);
    if (startDay === 0) {
        firstWeekBoundary.setDate(semesterStart.getDate() + 7);
    } else {
        firstWeekBoundary.setDate(semesterStart.getDate() + (7 - startDay));
    }

    if (targetDate < firstWeekBoundary) return 1;

    const diffTime = targetDate - firstWeekBoundary;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const additionalWeeks = Math.floor(diffDays / 7) + 1;

    return additionalWeeks + 1;
}

const transformSemesterDate = (date) => {
    const [day, month, year] = date.split('/');
    const endDateString = `${month}/${day}/${year}`;

    return new Date(endDateString);
};

export {renderSchedule};
