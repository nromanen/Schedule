import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { get, isEmpty } from 'lodash';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from './GroupSchedulePageTop/GroupSchedulePageTop';
import { links } from '../../constants/links';
import { places } from '../../constants/places';
import { renderSchedule } from '../../helper/renderSchedule';

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
        semesterId,
        teacherId,
        groupId,
    } = props;

    useEffect(() => {
        getDefaultSemester();
    }, []);
    console.log('props', props);

    const semDef = useSelector((state) => state.schedule.defaultSemester);
    console.log('selector', semDef);
    console.log('connect', defaultSemester);

    const submitSearchSchedule = (values) => {
        console.log('values', values);
        setSemesterId(values.semester);
        if (values.group > 0) {
            console.log('get group');
            setTypeOfSchedule('group');
            setGroupId(values.group);
            getGroupSchedule(values.group, values.semester);

            return;
        }
        if (values.teacher > 0) {
            console.log('get teacher');
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

    const getSchedule = () => {
        const { semester, group, teacher } = getDataFromParams(location);

        if (!semester) {
            handleSubmit({ semester: semDef.id });
        } else {
            handleSubmit({
                semester,
                group: group || 0,
                teacher: teacher || 0,
            });
        }
    };

    useEffect(() => {
        if (semDef.id) {
            getSchedule();
        }
    }, [semDef]);

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

    if (isEmpty(semDef))
        return (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );

    return (
        <>
            {getTop()}
            {loading ? (
                <section className="centered-container">
                    <CircularProgress />
                </section>
            ) : (
                renderSchedule(props, place)
            )}
        </>
    );
};
export default GroupSchedulePage;
