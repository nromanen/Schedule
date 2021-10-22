import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './TeacherSchedule.scss';

import TeacherScheduleForm from '../TeacherScheduleForm/TeacherScheduleForm';
import {
    clearTeacherScheduleFormService,
    getTeacherScheduleService,
} from '../../services/scheduleService';

import { renderTeacherRangeSchedule } from '../../helper/renderScheduleTable';

const TeacherSchedule = (props) => {
    const { schedule, viewTeacherScheduleResults } = props;

    useEffect(() => {
        renderTeacherRangeSchedule(schedule, viewTeacherScheduleResults);
    }, [viewTeacherScheduleResults]);

    return (
        <>
            <TeacherScheduleForm
                onSubmit={getTeacherScheduleService}
                onReset={clearTeacherScheduleFormService}
            />
            <section>{renderTeacherRangeSchedule(schedule, viewTeacherScheduleResults)}</section>
        </>
    );
};
const mapStateToProps = (state) => ({
    loading: state.loadingIndicator.loading,
    schedule: state.schedule.teacherRangeSchedule,
    viewTeacherScheduleResults: state.schedule.viewTeacherScheduleResults,
});
export default connect(mapStateToProps)(TeacherSchedule);
