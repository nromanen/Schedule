import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { getDataFromParams } from '../../utils/urlUtils';
import {
    getDefaultSemesterService,
    getFullSchedule,
    submitSearchSchedule,
} from '../../services/scheduleService';
import GroupSchedulePageTop from '../GroupSchedulePageTop/GroupSchedulePageTop';
import { setLoadingService } from '../../services/loadingService';
import { links } from '../../constants/links';
import { places } from '../../constants/places';
import { getScheduleByType } from '../../utils/sheduleUtils';
import { SCHEDULE_TYPES } from '../../constants/schedule/types';
import { renderSchedule } from '../../helper/renderSchedule';

const GroupSchedulePage = (props) => {
    const history = useHistory();
    const location = useLocation();
    const [place, setPlace] = useState(places.TOGETHER);
    const { defaultSemester, scheduleType, fullSchedule, groupId, teacherId, semesterId, loading } =
        props;

    const handleSubmit = (values) => {
        const { semester, group, teacher } = values;
        const groupPath = group ? `&group=${group}` : '';
        const teacherPath = teacher ? `&teacher=${teacher}` : '';
        setLoadingService(true);
        submitSearchSchedule(values, history);
        history.push(`${links.ScheduleFor}?semester=${semester}${groupPath}${teacherPath}`);
    };
    useEffect(() => {
        getFullSchedule();
    }, [place]);
    useEffect(() => {
        if (scheduleType === 'full' && fullSchedule.length === 0) {
            getScheduleByType()[SCHEDULE_TYPES.FULL]();
        }
    }, [scheduleType]);

    useEffect(() => {
        if (scheduleType === 'group') {
            getScheduleByType(groupId, semesterId)[SCHEDULE_TYPES.GROUP]();
        }
    }, [groupId]);
    useEffect(() => {
        if (scheduleType === 'teacher') {
            getScheduleByType(teacherId, semesterId)[scheduleType]();
        }
    }, [teacherId]);

    useEffect(() => getDefaultSemesterService(), []);

    const getSchedule = () => {
        if (scheduleType === '' && defaultSemester.id !== undefined) {
            handleSubmit({ semester: defaultSemester.id });

            return null;
        }
        if (scheduleType !== '' || location.pathname === links.HOME_PAGE) {
            return renderSchedule(props, place);
        }
        const { semester, teacher, group } = getDataFromParams(location);

        if (semester !== null) {
            handleSubmit({
                semester,
                group: group || 0,
                teacher: teacher || 0,
            });
        }
        return null;
    };

    const changePlace = ({ target }) => {
        if (target) {
            setPlace(target.value);
        }
    };

    const getTop = () =>
        scheduleType !== 'archived' && (
            <GroupSchedulePageTop
                scheduleType={scheduleType}
                onSubmit={handleSubmit}
                place={place}
                changePlace={changePlace}
            />
        );

    return (
        <>
            {getTop()}
            {loading ? (
                <section className="centered-container">
                    <CircularProgress />
                </section>
            ) : (
                getSchedule()
            )}
        </>
    );
};
const mapStateToProps = (state) => {
    return {
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
    };
};
export default connect(mapStateToProps)(GroupSchedulePage);
