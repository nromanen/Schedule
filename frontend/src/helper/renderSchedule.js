import React from 'react';
import {isEmpty} from 'lodash';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import {renderFullSchedule, renderGroupTable, renderWeekTable, ScheduleLegend} from './renderScheduleTable';
import DepartmentSchedule from '../components/DepartmentSchedule/DepartmentSchedule';
import {getGroupScheduleTitle, getTeacherScheduleTitle, getDepartmentScheduleTitle} from '../utils/titlesUtil';
import SchedulePublishBanner from "../components/GroupSchedulePage/SchedulePublishBanner/SchedulePublishBanner";
import DepartmentDownloadLink from '../components/DownloadLink/DepartmentDownloadLink';
import { matchDayNumberSysytemToDayName } from './renderScheduleTable';
import CalendarSchedule, {isShortSemester} from "../components/CalendarSchedule/CalendarSchedule";
import CalendarGroupSchedule from "../components/CalendarSchedule/CalendarGroupSchedule";
import {getWeekParity} from "../utils/weekUtils";

// ─── Shared components ────────────────────────────────────────────────────────

const emptySchedule = (t) => <p className="empty_schedule">{t('common:empty_schedule')}</p>;

export const ViewModeToggle = ({ viewMode, setViewMode, t }) => (
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

const ScheduleHeader = ({ semester, t, toggle }) => (
    <h1>
        <span className="schedule-week-badge">
            {getWeekParity(semester.startDay)} {t('week_label')}
        </span>
        {semester.description} ({semester.startDay}–{semester.endDay})
        {toggle}
    </h1>
);

// ─── Main render ──────────────────────────────────────────────────────────────

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

            const downloadLink = groupData?.id && (
                <DownloadLink entity="group" semesterId={semesterData.id} entityId={groupData.id} />
            );

            if (isShortSemester(semester.startDay, semester.endDay)) {
                return (
                    <>
                        {titleSuffix}
                        <h1>
                            {getGroupScheduleTitle(semester, group)}
                            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />
                            {downloadLink}
                        </h1>
                        <ScheduleLegend />
                        <CalendarGroupSchedule groupSchedule={groupSchedule} viewMode={viewMode} t={t} />
                    </>
                );
            }

            const currentWeekIsOdd = getWeekParity(semester.startDay) % 2 === 1;

            return (
                <>
                    {titleSuffix}
                    <h1>
                        {getGroupScheduleTitle(semester, group)}
                        {downloadLink}
                    </h1>
                    <h2>
                        <span className={currentWeekIsOdd ? 'currentDay' : ''}>
                            {t('common:odd_week')}
                        </span>
                    </h2>
                    {renderGroupTable(oddArray, true, semester)}
                    <h2>
                        <span className={!currentWeekIsOdd ? 'currentDay' : ''}>
                            {t('common:even_week')}
                        </span>
                    </h2>
                    {renderGroupTable(evenArray, false, semester)}
                </>
            );
        }

        case 'teacher': {
            const {semester, teacher, odd, even} = teacherSchedule;
            if (isEmpty(odd?.classes) && isEmpty(even?.classes)) return emptySchedule(t);

            const currentWeekIsOdd = getWeekParity(semester.startDay) % 2 === 1;

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
                        <span className={currentWeekIsOdd ? 'currentDay' : ''}>
                            {t('common:odd_week')}
                        </span>
                    </h2>
                    {renderWeekTable(odd)}
                    <h2>
                        <span className={!currentWeekIsOdd ? 'currentDay' : ''}>
                            {t('common:even_week')}
                        </span>
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
            if (isEmpty(resultArray)) return emptySchedule(t);

            const toggle = <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />;

            if (isShortSemester(semester.startDay, semester.endDay)) {
                return (
                    <>
                        {titleSuffix}
                        <ScheduleHeader semester={semester} t={t} toggle={toggle} />
                        <ScheduleLegend />
                        <CalendarSchedule fullSchedule={fullSchedule} viewMode={viewMode} t={t} />
                    </>
                );
            }

            const currentDay = matchDayNumberSysytemToDayName();
            const currentWeekIsOdd = getWeekParity(semester.startDay) % 2 === 1;

            const displaySchedule = viewMode === 'today'
                ? { ...fullSchedule, resultArray: resultArray.filter(d => d.day === currentDay) }
                : fullSchedule;

            const hasClassesToday = currentDay && displaySchedule.resultArray.length > 0;

            return (
                <>
                    {titleSuffix}
                    <ScheduleHeader semester={semester} t={t} toggle={toggle} />
                    {viewMode === 'today' && !hasClassesToday
                        ? <p className="empty_schedule">{t('common:no_classes_today', 'Сьогодні немає занять')}</p>
                        : renderFullSchedule(displaySchedule, viewMode === 'today' ? currentWeekIsOdd : null)
                    }
                </>
            );
        }

        default:
            return null;
    }
};

export {renderSchedule};