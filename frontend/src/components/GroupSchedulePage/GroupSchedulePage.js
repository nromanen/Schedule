import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from './GroupSchedulePageTop/GroupSchedulePageTop';
import { SCHEDULE_FOR_LINK } from '../../constants/links';
import { renderSchedule } from '../../helper/renderSchedule';
import { getScheduleType } from '../../helper/getScheduleType';

const GroupSchedulePage = (props) => {
    const history = useHistory();
    const location = useLocation();
    const {
        defaultSemester,
        scheduleType,
        loading,
        getDefaultSemester,
        getGroupSchedule,
        getTeacherSchedule,
        getFullSchedule,
    } = props;

    useEffect(() => {
        getDefaultSemester();
    }, []);

    const scheduleActions = {
        group: (values) => {
            const { semester, group } = values;
            const groupId = group ? group.id : null;
            getGroupSchedule(semester.id, groupId);
        },
        teacher: (values) => {
            const { semester, teacher } = values;
            const teacherId = teacher ? teacher.id : null;
            getTeacherSchedule(semester.id, teacherId);
        },
        full: (values) => {
            const { semester } = values;
            getFullSchedule(semester.id);
        },
    };

    const handleSubmit = (values) => {
        const { semester, group, teacher } = values;
        const groupPath = get(group, 'id') ? `&group=${group.id}` : '';
        const teacherPath = get(teacher, 'id') ? `&teacher=${teacher.id}` : '';
        const typeOfSchedule = getScheduleType(values);
        scheduleActions[typeOfSchedule](values);
        history.push(`${SCHEDULE_FOR_LINK}?semester=${semester.id}${groupPath}${teacherPath}`);
    };

    const getSchedule = () => {
        const { semester, group, teacher } = getDataFromParams(location);

        if (!semester) {
            handleSubmit({
                semester: defaultSemester,
                group: { id: group },
                teacher: { id: teacher },
            });
        } else {
            handleSubmit({
                semester: { id: Number(semester) },
                group: { id: group },
                teacher: { id: teacher },
            });
        }
    };

    useEffect(() => {
        if (defaultSemester.id) {
            getSchedule();
        }
    }, [defaultSemester]);

    const getTop = () =>
        scheduleType !== 'archived' && (
            <GroupSchedulePageTop scheduleType={scheduleType} handleSubmit={handleSubmit} />
        );

    return (
        <>
            {getTop()}
            {loading ? (
                <section className="centered-container">
                    <CircularProgress />
                </section>
            ) : (
                renderSchedule(props)
            )}
        </>
    );
};
export default GroupSchedulePage;
