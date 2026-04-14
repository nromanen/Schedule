import React from 'react';
import {isEmpty} from 'lodash';
import DownloadLink from '../DownloadLink/DownloadLink';
import {
    renderGroupTable,
    renderWeekTable,
    ScheduleLegend
} from '../../helper/renderScheduleTable';
import DepartmentSchedule from '../DepartmentSchedule/DepartmentSchedule';
import SchedulePublishBanner from '../GroupSchedulePage/SchedulePublishBanner/SchedulePublishBanner';
import DepartmentDownloadLink from '../DownloadLink/DepartmentDownloadLink';
import CalendarSchedule, {isShortSemester} from '../CalendarSchedule/CalendarSchedule';
import CalendarGroupSchedule from '../CalendarSchedule/CalendarGroupSchedule';
import {getTeacherWithPosition} from '../../helper/renderTeacher';
import {buildMergedTeacherSchedule} from '../../helper/mergeTeacherSchedules';
import {SEMESTER_COLORS} from '../../constants/semesterColors';
import {
    checkSemesterEnd,
    getWeekParity, isWeekOdd,
    matchDayNumberSystemToDayName,
    transformSemesterDate
} from "../../utils/dateUtils";
import FullScheduleTable from "../FullScheduleTable/FullScheduleTable";
import SemesterTitle from "./SemesterTitle";

const currentWeekIsOdd = (semester) => isWeekOdd(getWeekParity(semester.startDay));

// ─── Shared components ────────────────────────────────────────────────────────

const EmptySchedule = ({t}) => (
    <p className="empty_schedule">{t('common:empty_schedule')}</p>
);

export const ViewModeToggle = ({viewMode, setViewMode, t}) => (
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

const ScheduleTitleHeader = ({semester, subtitle, multiline = false, children}) => (
    <h1>
        <SemesterTitle semester={semester}/>
        {subtitle && (
            multiline ? (
                <>
                    <br/>
                    <span className="schedule-subtitle">{subtitle}</span>
                </>
            ) : (
                <>
                    <span className="schedule-title-divider"> | </span>
                    <span className="schedule-group-title">{subtitle}</span>
                </>
            )
        )}
        {children}
    </h1>
);

const ScheduleHeader = ({semester, t, toggle}) => (
    <h1>
        <span className="schedule-week-badge">
            {getWeekParity(semester.startDay)} {t('week_label')}
        </span>
        <SemesterTitle semester={semester}/>
        {toggle}
    </h1>
);

const WeekSection = ({label, isCurrentWeek, children}) => (
    <div className="week-section">
        <h2>
            <span className={isCurrentWeek ? 'currentDay' : ''}>
                {label}
            </span>
        </h2>
        {children}
    </div>
);

const TitleSuffix = ({isManager}) =>
    isManager ? (
        <div className="schedule-publish-banner-right">
            <SchedulePublishBanner/>
        </div>
    ) : null;

const SemesterEndedNotice = ({endDay, t}) =>
    checkSemesterEnd(endDay)
        ? <p className="semester-ended-notice">{t('common:semester_ended', 'Семестр вже завершився')}</p>
        : null;

// ─── Schedule views ───────────────────────────────────────────────────────────

const GroupScheduleView = ({groupSchedule, groupData, semesterData, isManager, t, viewMode, setViewMode}) => {
    const {semester, group, oddArray, evenArray} = groupSchedule;

    if (isEmpty(oddArray) && isEmpty(evenArray)) return <EmptySchedule t={t}/>;

    const downloadLink = groupData?.id && (
        <DownloadLink entity="group" semesterId={semesterData.id} entityId={groupData.id}/>
    );

    if (isShortSemester(semester.startDay, semester.endDay)) {
        return (
            <>
                <TitleSuffix isManager={isManager}/>
                <ScheduleTitleHeader semester={semester} subtitle={group?.title}>
                    <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t}/>
                    {downloadLink}
                </ScheduleTitleHeader>
                <ScheduleLegend/>
                <SemesterEndedNotice endDay={semester.endDay} t={t}/>
                <CalendarGroupSchedule groupSchedule={groupSchedule} viewMode={viewMode} t={t}/>
            </>
        );
    }

    return (
        <>
            <TitleSuffix isManager={isManager}/>
            <ScheduleTitleHeader semester={semester} subtitle={group?.title}>
                {downloadLink}
            </ScheduleTitleHeader>
            <ScheduleLegend variant="basic"/>
            <SemesterEndedNotice endDay={semester.endDay} t={t}/>
            <WeekSection label={t('common:odd_week')} isCurrentWeek={currentWeekIsOdd(semester)}>
                {renderGroupTable(oddArray, true, semester)}
            </WeekSection>
            <WeekSection label={t('common:even_week')} isCurrentWeek={!currentWeekIsOdd(semester)}>
                {renderGroupTable(evenArray, false, semester)}
            </WeekSection>
        </>
    );
};

export const isCardsEmpty = (cards) => Object.keys(cards).length === 0;

const TeacherScheduleView = ({teacherSchedule, isManager, t}) => {
    const schedules = (Array.isArray(teacherSchedule) ? teacherSchedule : [teacherSchedule])
        .sort((a, b) =>
            transformSemesterDate(a.semester.startDay) - transformSemesterDate(b.semester.startDay)
        );

    const hasAnyClasses = schedules.some(
        ({odd, even}) => !isEmpty(odd?.classes) || !isEmpty(even?.classes)
    );
    if (!hasAnyClasses) return <EmptySchedule t={t}/>;

    const {odd: mergedOdd, even: mergedEven, referenceSemester} = buildMergedTeacherSchedule(schedules);
    const semesterLegend = schedules.length > 1 && (
        <div className="semester-legend">
            {schedules.map(({semester: sem}, index) => (
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

    const downloadLinks = schedules.map(({semester: sem}) => (
        <DownloadLink
            key={sem.id}
            entity="teacher"
            semesterId={sem.id}
            entityId={schedules[0].teacher.id}
            label={schedules.length > 1 ? sem.description : null}
        />
    ));

    return (
        <>
            <TitleSuffix isManager={isManager}/>
            {schedules.length === 1 ? (
                <ScheduleTitleHeader
                    semester={schedules[0].semester}
                    subtitle={getTeacherWithPosition(schedules[0].teacher)}
                    multiline
                >
                    {downloadLinks}
                </ScheduleTitleHeader>
            ) : (
                <h1>
                    {getTeacherWithPosition(schedules[0].teacher)}
                    {downloadLinks}
                </h1>
            )}
            <div className="schedule-legends-row">
                <ScheduleLegend variant="basic"/>
                {semesterLegend}
            </div>
            <SemesterEndedNotice endDay={referenceSemester.semester.endDay} t={t}/>
            <WeekSection label={t('common:odd_week')} isCurrentWeek={currentWeekIsOdd(referenceSemester.semester)}>
                {isCardsEmpty(mergedOdd.cards) ? <EmptySchedule t={t}/> : renderWeekTable(mergedOdd)}
            </WeekSection>
            <WeekSection label={t('common:even_week')} isCurrentWeek={!currentWeekIsOdd(referenceSemester.semester)}>
                {isCardsEmpty(mergedEven.cards) ? <EmptySchedule t={t}/> : renderWeekTable(mergedEven)}
            </WeekSection>
        </>
    );
};

const DepartmentScheduleView = ({fullSchedule, departmentData, isManager, t}) => {
    const {resultArray, semester} = fullSchedule;
    if (isEmpty(resultArray)) return <EmptySchedule t={t}/>;

    const subtitle = departmentData && `${t('department_label')} ${departmentData.name}`;

    return (
        <>
            <TitleSuffix isManager={isManager}/>
            <ScheduleTitleHeader semester={semester} subtitle={subtitle}>
                <DepartmentDownloadLink
                    departmentName={departmentData?.name}
                    semesterDescription={semester?.description}
                    semesterStartDay={semester?.startDay}
                    semesterEndDay={semester?.endDay}
                />
            </ScheduleTitleHeader>
            <ScheduleLegend/>
            <SemesterEndedNotice endDay={semester.endDay} t={t}/>
            <DepartmentSchedule fullSchedule={fullSchedule} departmentId={departmentData?.id}/>
        </>
    );
};

const FullScheduleView = ({fullSchedule, isManager, t, viewMode, setViewMode}) => {
    const {resultArray, semester} = fullSchedule;
    if (isEmpty(resultArray)) return <EmptySchedule t={t}/>;

    const toggle = <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} t={t}/>;

    if (isShortSemester(semester.startDay, semester.endDay)) {
        return (
            <>
                <TitleSuffix isManager={isManager}/>
                <ScheduleHeader semester={semester} t={t} toggle={toggle}/>
                <ScheduleLegend/>
                <SemesterEndedNotice endDay={semester.endDay} t={t}/>
                <CalendarSchedule fullSchedule={fullSchedule} viewMode={viewMode} t={t}/>
            </>
        );
    }

    const currentDay = matchDayNumberSystemToDayName();
    const displaySchedule = viewMode === 'today'
        ? {...fullSchedule, resultArray: resultArray.filter(d => d.day === currentDay)}
        : fullSchedule;

    const hasClassesToday = currentDay && displaySchedule.resultArray.length > 0;

    return (
        <>
            <TitleSuffix isManager={isManager}/>
            <ScheduleHeader semester={semester} t={t} toggle={toggle}/>
            <SemesterEndedNotice endDay={semester.endDay} t={t}/>
            {viewMode === 'today' && !hasClassesToday
                ? <p className="empty_schedule">{t('common:no_classes_today', 'Сьогодні немає занять')}</p>
                :
                <FullScheduleTable
                    fullResultSchedule={displaySchedule}
                    todayWeekIsOdd={viewMode === 'today' ? currentWeekIsOdd(semester) : null}
                />
            }
        </>
    );
};

// ─── Dispatcher ───────────────────────────────────────────────────────────────

const scheduleViews = {
    group: GroupScheduleView,
    teacher: TeacherScheduleView,
    department: DepartmentScheduleView,
    full: FullScheduleView,
};

const ScheduleView = (props) => {
    const {scheduleType, notPublished, notPublishedMessage, t} = props;

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

export {ScheduleView};
