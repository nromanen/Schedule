import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { isNil } from 'lodash';
import './GroupSchedulePage.scss';
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
    const { defaultSemester, scheduleType, fullSchedule, groupId, teacherId, semesterId } = props;

    const handleSubmit = (values) => {
        const { semester, group, teacher } = values;
        const groupPath = group ? `&group=${group}` : '';
        const teacherPath = teacher ? `&teacher=${teacher}` : '';
        setLoadingService(true);
        submitSearchSchedule(values, history);
        history.push(`${links.ScheduleFor}?semester=${semester}${groupPath}${teacherPath}`);
    };

    // TODO check if we drop first
    useEffect(() => getFullSchedule(), [place]);
    useEffect(() => {
        if (scheduleType === 'full' && fullSchedule.length === 0) {
            getScheduleByType()[SCHEDULE_TYPES.FULL]();
        }
    });

    useEffect(() => {
        getScheduleByType(groupId, semesterId)[SCHEDULE_TYPES.GROUP]();
    }, [groupId]);
    useEffect(() => {
        getScheduleByType(teacherId, semesterId)[SCHEDULE_TYPES.TEACHER]();
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
                handleSubmit={handleSubmit}
                place={place}
                changePlace={changePlace}
            />
        );

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
