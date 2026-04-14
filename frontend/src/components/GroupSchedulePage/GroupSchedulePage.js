import React, {useEffect, useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { get } from 'lodash';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from './GroupSchedulePageTop/GroupSchedulePageTop';
import { SCHEDULE_FOR_LINK } from '../../constants/links';
import { ScheduleView } from '../ScheduleView/ScheduleView';
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
    const [viewMode, setViewMode] = useState('all'); // 'all' | 'today'
    const {
        defaultSemester,
        scheduleType,
        loading,
        getDefaultSemester,
        getGroupSchedule,
        getTeacherSchedule,
        getTeacherActiveSemestersSchedule,
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

        const semesterPath   = semester?.id ? `?semester=${semester.id}` : '?';
        const groupPath      = get(group,      'id') ? `&group=${group.id}`           : '';
        const teacherPath    = get(teacher,    'id') ? `&teacher=${teacher.id}`       : '';
        const departmentPath = get(department, 'id') ? `&department=${department.id}` : '';

        history.push(`${SCHEDULE_FOR_LINK}${semesterPath}${groupPath}${teacherPath}${departmentPath}`);
    };

    const getSchedule = () => {
        const { semester, group, teacher, department } = getDataFromParams(location);
        const semesterValue = semester ? { id: Number(semester) } : defaultSemester;
        const values = createSubmitValues(semesterValue, group, teacher, department);
        const typeOfSchedule = getScheduleType(values);

        if (!semester && typeOfSchedule === 'teacher' && teacher) {
            getTeacherActiveSemestersSchedule(Number(teacher));
            return;
        }

        if (!semester) {
            const groupPath = get(values.group, 'id') ? `&group=${values.group.id}` : '';
            const teacherPath = get(values.teacher, 'id') ? `&teacher=${values.teacher.id}` : '';
            const departmentPath = get(values.department, 'id') ? `&department=${values.department.id}` : '';
            history.push(`${SCHEDULE_FOR_LINK}?semester=${semesterValue.id}${groupPath}${teacherPath}${departmentPath}`);
        }

        scheduleActions[typeOfSchedule](values);
    };

    useEffect(() => {

        if (defaultSemester.id) {
            getSchedule();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSemester, location.search]);

    const getTop = () =>
        scheduleType !== 'archived' && !props.isTeacher && (
            <GroupSchedulePageTop
                scheduleType={scheduleType}
                handleSubmit={handleSubmit}
                isManager={props.isManager}
            />
        );

    return (
        <div className="schedule_page-container">
            {getTop()}
            {loading ? (
                <section className="centered-container">
                    <CircularProgress />
                </section>
            ) : (
                ScheduleView({ ...props, t, viewMode, setViewMode })
            )}
        </div>
    );
};

export default GroupSchedulePage;