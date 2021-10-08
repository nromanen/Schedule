import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { MdPictureAsPdf } from 'react-icons/md';
import i18n from 'i18next';
import {
    PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL,
    PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL,
} from '../../constants/axios';

import './GroupSchedulePage.scss';

import {
    makeGroupSchedule,
    makeFullSchedule,
    makeTeacherSchedule,
} from '../../helper/prepareSchedule';
import {
    renderGroupTable,
    renderFullSchedule,
    renderWeekTable,
} from '../../helper/renderScheduleTable';
import {
    getDefaultSemesterService,
    getFullSchedule,
    getGroupSchedule,
    getTeacherSchedule,
    submitSearchSchedule,
} from '../../services/scheduleService';

import GroupSchedulePageTop from '../GroupSchedulePageTop/GroupSchedulePageTop';
import { setLoadingService } from '../../services/loadingService';
import { links } from '../../constants/links';
import { places } from '../../constants/places';
import { getTeacherWithPosition } from '../../helper/renderTeacher';

const GroupSchedulePage = (props) => {
    const [place, setPlace] = useState(places.TOGETHER);
    const {
        scheduleType,
        groupSchedule,
        fullSchedule,
        teacherSchedule,
        groupId,
        teacherId,
        semesterId,
        loading,
    } = props;
    const history = useHistory();

    const location = useLocation();
    const { t } = useTranslation('common');
    const emptySchedule = () => <p className="empty_schedule">{t('common:empty_schedule')}</p>;
    const renderDownloadLink = (entity, semester, entityId) => {
        let link = '';
        const { language } = i18n;
        const languageToRequest = `&language=${language}`;
        if (semester && entityId) {
            switch (entity) {
                case 'group':
                    link = `${PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL}?groupId=${entityId}&semesterId=${semester}${languageToRequest}`;
                    break;
                case 'teacher':
                    link = `${PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL}?teacherId=${entityId}&semesterId=${semester}${languageToRequest}`;
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
        return null;
    };

    const renderGroupScheduleTitle = (semester, group) => {
        let title = '';
        if (semester) {
            title += `${semester.description} (${semester.startDay}-${semester.endDay}) : `;
        }
        if (group) {
            title += group.title ? group.title : '';
        }
        return title;
    };
    const renderTeacherScheduleTitle = (semester, teacher) => {
        let title = '';
        if (semester) {
            title += `${semester.description} (${semester.startDay}-${semester.endDay}) : `;
        }
        if (teacher) {
            title += getTeacherWithPosition(teacher);
        }
        return title;
    };

    const renderSchedule = () => {
        switch (scheduleType) {
            case 'group': {
                if (
                    (!groupSchedule ||
                        (groupSchedule.schedule && groupSchedule.schedule.length === 0)) &&
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
                                    resultArrays.group,
                                )}
                                {renderDownloadLink('group', props.semesterId, props.groupId)}
                            </h1>
                            <h2>{t('common:odd_week')}</h2>
                            {renderGroupTable(
                                resultArrays.oddArray,
                                1,
                                resultArrays.semester,
                                place,
                            )}
                            <h2>{t('common:even_week')}</h2>
                            {renderGroupTable(
                                resultArrays.evenArray,
                                0,
                                resultArrays.semester,
                                place,
                            )}
                        </>
                    );
                }
                setLoadingService(false);
                break;
            }
            case 'teacher':
                if (
                    (!teacherSchedule ||
                        !teacherSchedule.days ||
                        teacherSchedule.days.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                if (teacherSchedule) {
                    const teacher = makeTeacherSchedule(teacherSchedule);
                    if (teacher.done) {
                        setLoadingService(false);
                        return (
                            <>
                                <h1>
                                    {renderTeacherScheduleTitle(teacher.semester, teacher.teacher)}
                                    {renderDownloadLink(
                                        'teacher',
                                        props.semesterId,
                                        props.teacherId,
                                    )}
                                </h1>
                                <h2>{t('common:odd_week')}</h2>
                                {renderWeekTable(teacher.odd, 1, place)}
                                <h2>{t('common:even_week')}</h2>
                                {renderWeekTable(teacher.even, 0, place)}
                            </>
                        );
                    }
                } else setLoadingService(false);
                break;
            case 'full': {
                if (
                    (!fullSchedule.schedule || fullSchedule.schedule.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                const result = makeFullSchedule(fullSchedule);

                if (result.groupsCount || result.done) {
                    setLoadingService(false);
                    return renderFullSchedule(result, place);
                }
                setLoadingService(false);
                break;
            }
            default:
                return null;
        }
        return null;
    };

    const handleSubmit = (values) => {
        const { semester, group, teacher } = values;
        const groupPath = group ? `&group=${group}` : '';
        const teacherPath = teacher ? `&teacher=${teacher}` : '';
        setLoadingService('true');
        submitSearchSchedule(values, history);
        history.push(`${links.ScheduleFor}?semester=${semester}${groupPath}${teacherPath}`);
    };
    useEffect(() => getFullSchedule(), [place]);

    useEffect(() => {
        if (scheduleType === 'group') getGroupSchedule(groupId, semesterId);
    }, [groupId]);
    useEffect(() => {
        if (scheduleType === 'teacher') getTeacherSchedule(teacherId, semesterId);
    }, [teacherId]);

    useEffect(() => {
        if (scheduleType === 'full' && fullSchedule.length === 0) {
            getFullSchedule();
        }
    });
    useEffect(() => {
        getDefaultSemesterService();
    }, []);

    const getSchedule = () => {
        if (props.scheduleType === '' && props.defaultSemester.id !== undefined) {
            const semester = `${props.defaultSemester.id}`;
            handleSubmit({ semester });

            return null;
        }
        if (props.scheduleType !== '' || location.pathname === links.HOME_PAGE) {
            return renderSchedule();
        }

        const params = new URLSearchParams(location.search);

        const semester = params.get('semester');
        const teacher = params.get('teacher');
        const group = params.get('group');

        if (semester !== null) {
            handleSubmit({
                semester,
                group: group != null ? group : 0,
                teacher: teacher != null ? teacher : 0,
            });
        }
        return null;
    };

    const changePlace = (e) => {
        if (e.target) {
            setPlace(e.target.value);
        }
    };

    const getTop = () => {
        if (props.scheduleType !== 'archived') {
            return (
                <GroupSchedulePageTop
                    scheduleType={props.scheduleType}
                    onSubmit={handleSubmit}
                    place={place}
                    onChange={changePlace}
                />
            );
        }
        return null;
    };
    return (
        <>
            {getTop()}
            {getSchedule()}
        </>
    );
};
const mapStateToProps = (state) => ({
    scheduleType: state.schedule.scheduleType,
    groupSchedule: state.schedule.groupSchedule,
    fullSchedule: state.schedule.fullSchedule,
    teacherSchedule: state.schedule.teacherSchedule,
    groupId: state.schedule.scheduleGroupId,
    teacherId: state.schedule.scheduleTeacherId,
    semesterId: state.schedule.scheduleSemesterId,
    loading: state.loadingIndicator.loading,
    defaultSemester: state.schedule.defaultSemester,
    semesters: state.schedule.semesters,
});
export default connect(mapStateToProps)(GroupSchedulePage);
