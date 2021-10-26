import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import './TeacherSchedule.scss';

import TeacherScheduleForm from '../TeacherScheduleForm/TeacherScheduleForm';
import { getTeacherScheduleService } from '../../services/scheduleService';

import { renderTeacherRangeSchedule } from '../../helper/renderScheduleTable';
import { TEACHER_SCHEDULE_FORM } from '../../constants/reduxForms';

const TeacherSchedule = (props) => {
    const { schedule, viewTeacherScheduleResults, clearForm } = props;

    useEffect(() => {
        renderTeacherRangeSchedule(schedule, viewTeacherScheduleResults);
    }, [viewTeacherScheduleResults]);

    return (
        <>
            <TeacherScheduleForm
                onSubmit={getTeacherScheduleService}
                onReset={() => clearForm(TEACHER_SCHEDULE_FORM)}
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

const mapDispatchToProps = (dispatch) => ({
    clearForm: (formName) => dispatch(reset(formName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherSchedule);
