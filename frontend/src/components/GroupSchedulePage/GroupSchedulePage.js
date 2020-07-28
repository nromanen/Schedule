import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL,
    PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL
} from '../../constants/axios';

import './GroupSchedulePage.scss';
import { MdPictureAsPdf } from 'react-icons/md';

import {
    makeGroupSchedule,
    makeFullSchedule,
    makeTeacherSchedule
} from '../../helper/prepareSchedule';
import {
    renderGroupTable,
    renderFullSchedule,
    renderWeekTable
} from '../../helper/renderScheduleTable';
import { submitSearchSchedule } from '../../services/scheduleService';

import GroupSchedulePageTop from '../GroupSchedulePageTop/GroupSchedulePageTop';
import { setLoadingService } from '../../services/loadingService';

const GroupSchedulePage = props => {
    let { groupSchedule, fullSchedule, teacherSchedule } = props;

    const emptySchedule = () => (
        <p className="empty_schedule">{t('common:empty_schedule')}</p>
    );
    const { t } = useTranslation('common');

    const renderDownloadLink = (entity, semesterId, entityId) => {
        let link = '';
        if (semesterId && entityId) {
            switch (entity) {
                case 'group':
                    link =
                        PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL +
                        '?groupId=' +
                        entityId +
                        '&semesterId=' +
                        semesterId;
                    break;
                case 'teacher':
                    link =
                        PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL +
                        '?teacherId=' +
                        entityId +
                        '&semesterId=' +
                        semesterId;
                    break;
                default:
                    break;
            }
            return (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="contained"
                    color="primary"
                    className="pdf_link"
                    download
                >
                    <MdPictureAsPdf className="svg-btn" />
                    {t('common:download_pdf')}
                </a>
            );
        }
    };

    const renderGroupScheduleTitle = (semester, group) => {
        let title = '';
        if (semester) {
            title +=
                semester.description +
                ' (' +
                semester.startDay +
                '-' +
                semester.endDay +
                ') : ';
        }
        if (group) {
            title += group.title ? group.title : '';
        }
        return title;
    };
    const renderTeacherScheduleTitle = (semester, teacher) => {
        let title = '';
        if (semester) {
            title +=
                semester.description +
                ' (' +
                semester.startDay +
                '-' +
                semester.endDay +
                ') : ';
        }
        if (teacher) {
            title +=
                teacher.position +
                ' ' +
                teacher.surname +
                ' ' +
                teacher.name +
                ' ' +
                teacher.patronymic;
        }
        return title;
    };

    const renderSchedule = () => {
        switch (props.scheduleType) {
            case 'group':
                if (
                    (!groupSchedule ||
                        (groupSchedule.schedule &&
                            groupSchedule.schedule.length === 0)) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }

                const resultArrays = makeGroupSchedule(groupSchedule);
                if (resultArrays.done) {
                    setLoadingService(false);
                    return (
                        <>
                            <h1>
                                {renderGroupScheduleTitle(
                                    resultArrays.semester,
                                    resultArrays.group
                                )}
                                {renderDownloadLink(
                                    'group',
                                    props.semesterId,
                                    props.groupId
                                )}
                            </h1>
                            <h2>{t('common:odd_week')}</h2>
                            {renderGroupTable(
                                resultArrays.oddArray,
                                1,
                                resultArrays.semester
                            )}
                            <h2>{t('common:even_week')}</h2>
                            {renderGroupTable(
                                resultArrays.evenArray,
                                0,
                                resultArrays.semester
                            )}
                        </>
                    );
                }
                break;
            case 'teacher':
                if (
                    (!teacherSchedule ||
                        !teacherSchedule.days ||
                        teacherSchedule.days.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                const teacher = makeTeacherSchedule(teacherSchedule);
                if (teacher.done) {
                    setLoadingService(false);
                    return (
                        <>
                            <h1>
                                {renderTeacherScheduleTitle(
                                    teacher.semester,
                                    teacher.teacher
                                )}
                                {renderDownloadLink(
                                    'teacher',
                                    props.semesterId,
                                    props.teacherId
                                )}
                            </h1>
                            <h2>{t('common:odd_week')}</h2>
                            {renderWeekTable(teacher.odd, 1)}
                            <h2>{t('common:even_week')}</h2>
                            {renderWeekTable(teacher.even, 0)}
                        </>
                    );
                }
                break;
            case 'full':
                if (
                    (!fullSchedule.schedule ||
                        fullSchedule.schedule.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                const result = makeFullSchedule(fullSchedule);
                if (result.groupsCount || result.done) {
                    setLoadingService(false);
                    return renderFullSchedule(result);
                }
                break;
            case 'archived':
                if (
                    (!fullSchedule.schedule ||
                        fullSchedule.schedule.length === 0) &&
                    !props.loading
                ) {
                    return '';
                }
                const archive = makeFullSchedule(fullSchedule);
                if (archive.groupsCount || archive.done) {
                    setLoadingService(false);
                    return renderFullSchedule(archive);
                }
                break;
            default:
                return;
        }
    };

    const handleSubmit = values => {
        setLoadingService('true');
        submitSearchSchedule(values);
    };

    return (
        <>
            {props.scheduleType !== 'archived' ? (
                <GroupSchedulePageTop onSubmit={handleSubmit} />
            ) : (
                ''
            )}
            {renderSchedule()}
        </>
    );
};
const mapStateToProps = state => ({
    scheduleType: state.schedule.scheduleType,
    groupSchedule: state.schedule.groupSchedule,
    fullSchedule: state.schedule.fullSchedule,
    teacherSchedule: state.schedule.teacherSchedule,
    groupId: state.schedule.scheduleGroupId,
    teacherId: state.schedule.scheduleTeacherId,
    semesterId: state.schedule.scheduleSemesterId,
    loading: state.loadingIndicator.loading
});
export default connect(mapStateToProps)(GroupSchedulePage);
