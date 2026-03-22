import React from 'react';
import { isEmpty } from 'lodash';
import DownloadLink from '../components/DownloadLink/DownloadLink';
import { renderFullSchedule, renderGroupTable, renderWeekTable, ScheduleLegend } from './renderScheduleTable';
import DepartmentSchedule from '../components/DepartmentSchedule/DepartmentSchedule';
import { getGroupScheduleTitle, getTeacherScheduleTitle, getDepartmentScheduleTitle } from '../utils/titlesUtil';
import SchedulePublishBanner from '../components/GroupSchedulePage/SchedulePublishBanner/SchedulePublishBanner';
import DepartmentDownloadLink from '../components/DownloadLink/DepartmentDownloadLink';
import { matchDayNumberSystemToDayName } from './renderScheduleTable';
import CalendarSchedule, { isShortSemester } from '../components/CalendarSchedule/CalendarSchedule';
import CalendarGroupSchedule from '../components/CalendarSchedule/CalendarGroupSchedule';
import { getWeekParity, transformSemesterDate } from '../utils/weekUtils';
import { getTeacherWithPosition } from './renderTeacher';
import { buildMergedTeacherSchedule } from './mergeTeacherSchedules';
import { SEMESTER_COLORS } from '../constants/semesterColors';

// ─── Shared components ────────────────────────────────────────────────────────

const EmptySchedule = ({ t }) => (
    <p className="empty_schedule">{t('common:empty_schedule')}</p>
);

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

const WeekSection = ({ label, isCurrentWeek, children }) => (
    <>
        <h2>
            <span className={isCurrentWeek ? 'currentDay' : ''}>
                {label}
            </span>
        </h2>
        {children}
    </>
);

const TitleSuffix = ({ isManager }) =>
    isManager ? (
        <div className="schedule-publish-banner-right">
            <SchedulePublishBanner />
        </div>
    ) : null;

// ─── Schedule views ───────────────────────────────────────────────────────────

const GroupScheduleView = ({ groupSchedule, groupData, semesterData, isManager, t, viewMode, setViewMode }) => {
    const { semester, group, oddArray, evenArray } = groupSchedule;

    if (isEmpty(oddArray) && isEmpty(evenArray)) return <EmptySchedule t={t} />;

    const downloadLink = groupData?.id && (
        <DownloadLink entity="group" semesterId={semesterData.id} entityId={groupData.id} />
    );

    if (isShortSemester(semester.startDay, semester.endDay)) {
        return (
            <>
                <TitleSuffix isManager={isManager} />
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
            <TitleSuffix isManager={isManager} />
            <h1>
                {getGroupScheduleTitle(semester, group)}
                {downloadLink}
            </h1>
            <ScheduleLegend />
            <WeekSection label={t('common:odd_week')} isCurrentWeek={currentWeekIsOdd}>
                {renderGroupTable(oddArray, true, semester)}
            </WeekSection>
            <WeekSection label={t('common:even_week')} isCurrentWeek={!currentWeekIsOdd}>
                {renderGroupTable(evenArray, false, semester)}
            </WeekSection>
        </>
    );
};

const TeacherScheduleView = ({ teacherSchedule, isManager, t }) => {
    const schedules = (Array.isArray(teacherSchedule) ? teacherSchedule : [teacherSchedule])
        .sort((a, b) =>
            transformSemesterDate(a.semester.startDay) - transformSemesterDate(b.semester.startDay)
        );

    const hasAnyClasses = schedules.some(
        ({ odd, even }) => !isEmpty(odd?.classes) || !isEmpty(even?.classes)
    );
    if (!hasAnyClasses) return <EmptySchedule t={t} />;

    const { odd: mergedOdd, even: mergedEven, referenceSemester } = buildMergedTeacherSchedule(schedules);
    const currentWeekIsOdd = getWeekParity(referenceSemester.semester.startDay) % 2 === 1;

    const semesterLegend = schedules.length > 1 && (
        <div className="semester-legend">
            {schedules.map(({ semester: sem }, index) => (
                <span
                    key={sem.id}
                    className="semester-legend__item"
                    style={{
                        backgroundColor: SEMESTER_COLORS[index % SEMESTER_COLORS.length],
                        color: 'white',
                    }}
                >
                    {sem.description} ({sem.startDay?.slice(0, 5)}-{sem.endDay?.slice(0, 5)})
                </span>
            ))}
        </div>
    );

    return (
        <>
            <TitleSuffix isManager={isManager} />
            <h1>
                {schedules.length === 1
                    ? getTeacherScheduleTitle(schedules[0].semester, schedules[0].teacher)
                    : getTeacherWithPosition(schedules[0].teacher)
                }
                {schedules.map(({ semester: sem }) => (
                    <DownloadLink
                        key={sem.id}
                        entity="teacher"
                        semesterId={sem.id}
                        entityId={schedules[0].teacher.id}
                        label={schedules.length > 1 ? sem.description : null}
                    />
                ))}
            </h1>
            <div className="schedule-legends-row">
                <ScheduleLegend />
                {semesterLegend}
            </div>
            <WeekSection label={t('common:odd_week')} isCurrentWeek={currentWeekIsOdd}>
                {isEmpty(mergedOdd.classes) ? <EmptySchedule t={t} /> : renderWeekTable(mergedOdd)}
            </WeekSection>
            <WeekSection label={t('common:even_week')} isCurrentWeek={!currentWeekIsOdd}>
                {isEmpty(mergedEven.classes) ? <EmptySchedule t={t} /> : renderWeekTable(mergedEven)}
            </WeekSection>
        </>
    );
};

const DepartmentScheduleView = ({ fullSchedule, departmentData, isManager, t }) => {
    const { resultArray, semester } = fullSchedule;
    if (isEmpty(resultArray)) return <EmptySchedule t={t} />;

    return (
        <>
            <TitleSuffix isManager={isManager} />
            <h1>
                {getDepartmentScheduleTitle(semester, departmentData)}
                <DepartmentDownloadLink
                    departmentName={departmentData?.name}
                    semesterDescription={semester?.description}
                    semesterStartDay={semester?.startDay}
                    semesterEndDay={semester?.endDay}
                />
            </h1>
            <ScheduleLegend />
            <DepartmentSchedule fullSchedule={fullSchedule} departmentId={departmentData?.id} />
        </>
    );
};

const FullScheduleView = ({ fullSchedule, isManager, t, viewMode, setViewMode }) => {
    const { resultArray, semester } = fullSchedule;
    if (isEmpty(resultArray)) return <EmptySchedule t={t} />;

    const toggle = <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t} />;

    if (isShortSemester(semester.startDay, semester.endDay)) {
        return (
            <>
                <TitleSuffix isManager={isManager} />
                <ScheduleHeader semester={semester} t={t} toggle={toggle} />
                <ScheduleLegend />
                <CalendarSchedule fullSchedule={fullSchedule} viewMode={viewMode} t={t} />
            </>
        );
    }

    const currentDay = matchDayNumberSystemToDayName();
    const currentWeekIsOdd = getWeekParity(semester.startDay) % 2 === 1;

    const displaySchedule = viewMode === 'today'
        ? { ...fullSchedule, resultArray: resultArray.filter(d => d.day === currentDay) }
        : fullSchedule;

    const hasClassesToday = currentDay && displaySchedule.resultArray.length > 0;

    return (
        <>
            <TitleSuffix isManager={isManager} />
            <ScheduleHeader semester={semester} t={t} toggle={toggle} />
            {viewMode === 'today' && !hasClassesToday
                ? <p className="empty_schedule">{t('common:no_classes_today', 'Сьогодні немає занять')}</p>
                : renderFullSchedule(displaySchedule, viewMode === 'today' ? currentWeekIsOdd : null)
            }
        </>
    );
};

// ─── Dispatcher ───────────────────────────────────────────────────────────────

const scheduleViews = {
    group:      GroupScheduleView,
    teacher:    TeacherScheduleView,
    department: DepartmentScheduleView,
    full:       FullScheduleView,
};

const ScheduleView = (props) => {
    const { scheduleType, notPublished, notPublishedMessage, t } = props;

    if (notPublished) {
        return (
            <div className="schedule-not-published">
                <h2>{notPublishedMessage || t('common:schedule_not_published')}</h2>
            </div>
        );
    }

    const Component = scheduleViews[scheduleType];
    return Component ? <Component {...props} /> : null;
};

export { ScheduleView };