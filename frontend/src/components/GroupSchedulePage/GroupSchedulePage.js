import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './GroupSchedulePage.scss';
import { CircularProgress } from '@material-ui/core';
import { getDataFromParams } from '../../utils/urlUtils';
import GroupSchedulePageTop from './GroupSchedulePageTop/GroupSchedulePageTop';
import { links } from '../../constants/links';
import { places } from '../../constants/places';
import { renderSchedule } from '../../helper/renderSchedule';
import { submitSearchSchedule } from '../../helper/submitSearchSchedule';

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

    useEffect(() => {
        getDefaultSemester();
    }, []);

    const handleSubmit = (values) => {
        const actionCalls = {
            setSemesterId,
            setTypeOfSchedule,
            setGroupId,
            getGroupSchedule,
            setTeacherId,
            getTeacherSchedule,
            getFullSchedule,
        };
        const { semester, group, teacher } = values;
        const groupPath = group ? `&group=${group}` : '';
        const teacherPath = teacher ? `&teacher=${teacher}` : '';
        submitSearchSchedule(values, actionCalls);
        history.push(`${links.ScheduleFor}?semester=${semester}${groupPath}${teacherPath}`);
    };

    const getSchedule = () => {
        const { semester, group, teacher } = getDataFromParams(location);

        if (!semester) {
            handleSubmit({ semester: defaultSemester.id });
        } else {
            handleSubmit({
                semester,
                group: group || 0,
                teacher: teacher || 0,
            });
        }
    };

    useEffect(() => {
        if (defaultSemester.id) {
            getSchedule();
        }
    }, [defaultSemester]);

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
                renderSchedule(props, place)
            )}
        </>
    );
};
export default GroupSchedulePage;
