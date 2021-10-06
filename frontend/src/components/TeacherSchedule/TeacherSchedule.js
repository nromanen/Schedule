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
    const handleFormReset = () => {
        clearTeacherScheduleFormService();
    };
    const submit = (values) => {
        getTeacherScheduleService(values);
    };

    useEffect(() => {
        renderTeacherRangeSchedule(props.schedule, props.viewTeacherScheduleResults);
    }, [props.viewTeacherScheduleResults]);

    return (
        <>
            <TeacherScheduleForm onSubmit={submit} onReset={handleFormReset} />
            <section>
                {renderTeacherRangeSchedule(props.schedule, props.viewTeacherScheduleResults)}
            </section>
        </>
    );
};
const mapStateToProps = (state) => ({
    loading: state.loadingIndicator.loading,
    schedule: state.schedule.teacherRangeSchedule,
    viewTeacherScheduleResults: state.schedule.viewTeacherScheduleResults,
});
export default connect(mapStateToProps)(TeacherSchedule);
