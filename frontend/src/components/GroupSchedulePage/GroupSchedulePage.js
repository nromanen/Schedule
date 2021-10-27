import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { get, isEmpty, isNil } from 'lodash';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from '../GroupSchedulePageTop/GroupSchedulePageTop';
import { links } from '../../constants/links';
import { places } from '../../constants/places';
import { renderSchedule } from '../../helper/renderSchedule';
import {
    getDefaultSemesterRequsted,
    setScheduleSemesterId,
    setScheduleType,
    setScheduleGroupId,
    setScheduleTeacherId,
    getGroupScheduleStart,
    getTeacherScheduleStart,
    getFullScheduleStart,
} from '../../actions/schedule';

const GroupSchedulePage = (props) => {
    const history = useHistory();
    const location = useLocation();
    const [place, setPlace] = useState(places.TOGETHER);
    const {
        defaultSemester,
        scheduleType,
        loading,
        getDefaultSemester,
        setSemesterId,
        setTypeOfSchedule,
        setGroupId,
        setTeacherId,
        getGroupSchedule,
        getTeacherSchedule,
        getFullSchedule,
    } = props;

    const submitSearchSchedule = (values) => {
        setSemesterId(values.semester);
        if (values.group > 0) {
            setTypeOfSchedule('group');
            setGroupId(values.group);
            getGroupSchedule(values.group, values.semester);

            return;
        }
        if (values.teacher > 0) {
            setTypeOfSchedule('teacher');
            setTeacherId(values.teacher);
            getTeacherSchedule(values.teacher, values.semester);
            return;
        }
        if (
            (values.teacher === 0 && values.group === 0) ||
            (!get(values, 'group') && values.teacher === 0) ||
            (!get(values, 'teacher') && values.group === 0) ||
            (!get(values, 'group') && !get(values, 'teacher'))
        ) {
            console.log('get full');
            setTypeOfSchedule('full');
            getFullSchedule(values.semester);
        }
    };

    const handleSubmit = (values) => {
        const { semester, group, teacher } = values;
        const groupPath = group ? `&group=${group}` : '';
        const teacherPath = teacher ? `&teacher=${teacher}` : '';
        submitSearchSchedule(values);
        history.push(`${links.ScheduleFor}?semester=${semester}${groupPath}${teacherPath}`);
    };

    // useEffect(() => {
    //     if (scheduleType === 'full' && fullSchedule.length === 0) {
    //         getScheduleByType()[SCHEDULE_TYPES.FULL]();
    //     }
    // }, [scheduleType]);

    // useEffect(() => {
    //     if (scheduleType === 'group') {
    //         getScheduleByType(groupId, semesterId)[SCHEDULE_TYPES.GROUP]();
    //     }
    // }, [groupId]);
    // useEffect(() => {
    //     if (scheduleType === 'teacher') {
    //         getScheduleByType(teacherId, semesterId)[scheduleType]();
    //     }
    // }, [teacherId]);

    useEffect(() => {
        getDefaultSemester();
    }, []);

    const getSchedule = () => {
        console.log(defaultSemester.id);
        const { semester, group, teacher } = getDataFromParams(location);

        if (defaultSemester.id !== undefined && isNil(semester)) {
            console.log('first render');
            handleSubmit({ semester: defaultSemester.id });
        }

        if (scheduleType !== '' || location.pathname === links.HOME_PAGE) {
            console.log('loads data');
            return renderSchedule(props, place);
        }

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

const mapDispatchToProps = (dispatch) => ({
    getDefaultSemester: () => dispatch(getDefaultSemesterRequsted()),
    setSemesterId: (id) => dispatch(setScheduleSemesterId(id)),
    setTypeOfSchedule: (type) => dispatch(setScheduleType(type)),
    setGroupId: (id) => dispatch(setScheduleGroupId(id)),
    setTeacherId: (id) => dispatch(setScheduleTeacherId(id)),
    getGroupSchedule: (groupId, semesterId) => dispatch(getGroupScheduleStart(groupId, semesterId)),
    getTeacherSchedule: (groupId, semesterId) =>
        dispatch(getTeacherScheduleStart(groupId, semesterId)),
    getFullSchedule: (semesterId) => dispatch(getFullScheduleStart(semesterId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSchedulePage);
