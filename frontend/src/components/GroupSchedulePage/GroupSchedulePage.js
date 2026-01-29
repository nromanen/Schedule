import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from './GroupSchedulePageTop/GroupSchedulePageTop';
import { SCHEDULE_FOR_LINK } from '../../constants/links';
import { renderSchedule } from '../../helper/renderSchedule';
import { getScheduleType } from '../../helper/getScheduleType';
import { getAllDepartmentsService } from '../../services/departmentService';

const createSubmitValues = (semester, group, teacher, department) => ({
    semester,
    group: { id: group },
    teacher: { id: teacher },
    department: { id: department },
});

const GroupSchedulePage = (props) => {
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation('common');
    const {
        defaultSemester,
        scheduleType,
        loading,
        getDefaultSemester,
        getGroupSchedule,
        getTeacherSchedule,
        getFullSchedule,
        getDepartmentSchedule,
        groupSchedule,
        teacherSchedule,
        fullSchedule,
    } = props;

    useEffect(() => {
        getDefaultSemester();
        getAllDepartmentsService();
    }, [getDefaultSemester]);

    useEffect(() => {
        if (!loading && scheduleType) {
            const timer = setTimeout(() => {
                const currentDayElement = document.querySelector('.currentDay');
                if (currentDayElement) {
                    currentDayElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [loading, scheduleType, groupSchedule, teacherSchedule, fullSchedule]);

    const scheduleActions = {
        group: (values) => {
            const { semester, group } = values;
            getGroupSchedule(semester.id, group.id);
        },
        teacher: (values) => {
            const { semester, teacher } = values;
            getTeacherSchedule(semester.id, teacher.id);
        },
        full: (values) => {
            const { semester } = values;
            getFullSchedule(semester.id);
        },
        department: (values) => {
            const { semester, department } = values;
            getDepartmentSchedule(semester.id, department.id);
        },
    };

    const handleSubmit = (values) => {
        const { semester, group, teacher, department } = values;
        const groupPath = get(group, 'id') ? `&group=${group.id}` : '';
        const teacherPath = get(teacher, 'id') ? `&teacher=${teacher.id}` : '';
        const departmentPath = get(department, 'id') ? `&department=${department.id}` : '';
        const typeOfSchedule = getScheduleType(values);
        scheduleActions[typeOfSchedule](values);
        history.push(`${SCHEDULE_FOR_LINK}?semester=${semester.id}${groupPath}${teacherPath}${departmentPath}`);
    };

    const getSchedule = () => {
        const { semester, group, teacher, department } = getDataFromParams(location);

        if (!semester) {
            handleSubmit(createSubmitValues(defaultSemester, group, teacher, department));
        } else {
            handleSubmit(createSubmitValues({ id: Number(semester) }, group, teacher, department));
        }
    };

    useEffect(() => {
        if (defaultSemester.id) {
            getSchedule();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                renderSchedule({ ...props, t })
            )}
        </>
    );
};

export default GroupSchedulePage;