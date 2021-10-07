import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';

import './TeacherScheduleForm.scss';

import { MdPlayArrow, MdViewModule, MdViewHeadline } from 'react-icons/md';

import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';
import * as moment from 'moment';
import { required, lessThanDate, greaterThanDate } from '../../validation/validateFields';

import { TEACHER_SCHEDULE_FORM } from '../../constants/reduxForms';
import renderMonthPicker from '../../share/renderedFields/timeSemester';
import Card from '../../share/Card/Card';
import { setTeacherServiceViewType } from '../../services/scheduleService';

const TeacherScheduleForm = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit } = props;
    const isSchedule = false;
    const dateFormat = 'DD/MM/YYYY';

    useEffect(() => {
        props.initialize({
            startDay: moment(new Date(), dateFormat).format(dateFormat),
            endDay: moment(new Date(), dateFormat).add(7, 'd').format(dateFormat),
        });
    }, [isSchedule]);
    return (
        <Card class="form-card teacher-schedule-form">
            <form onSubmit={handleSubmit}>
                <div className="form-line-block">
                    <h2 className="form-title">{t('common:select_dates_for_teacher_schedule')}</h2>
                    <Field
                        className="time-input"
                        name="startDay"
                        component={renderMonthPicker}
                        label={`${t('class_from_label')}:`}
                        validate={[required, lessThanDate]}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={`${t('class_to_label')}:`}
                        validate={[required, greaterThanDate]}
                    />
                    <div className="form-buttons-container">
                        <Button
                            className="buttons-style"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            <MdPlayArrow title={t('full_schedule_label')} className="svg-btn" />
                        </Button>
                        <Button
                            className="view-type-icon first-view-type-button"
                            variant="contained"
                            color="secondary"
                            title={t('common:block_view')}
                            onClick={() => setTeacherServiceViewType('blocks-view')}
                        >
                            <MdViewModule className="svg-btn" />
                        </Button>
                        <Button
                            className="view-type-icon"
                            variant="contained"
                            color="secondary"
                            title={t('common:list_view')}
                            onClick={() => setTeacherServiceViewType('list-view')}
                        >
                            <MdViewHeadline className="svg-btn" />
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    classScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: TEACHER_SCHEDULE_FORM,
    })(TeacherScheduleForm),
);
