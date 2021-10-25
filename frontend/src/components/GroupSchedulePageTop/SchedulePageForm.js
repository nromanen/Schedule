import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdPlayArrow } from 'react-icons/md';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';
import { TEACHER_SCHEDULE_LABEL } from '../../constants/translationLabels/common';
import {
    showAllPublicSemestersService,
    showAllPublicTeachersService,
} from '../../services/scheduleService';
import GroupsList from './GroupsList';
import SemestersList from './SemestersList';
import TeachersList from './TeachersList';

const SchedulePageForm = (props) => {
    const {
        handleSubmit,
        handleFormSubmit,
        semester,
        group,
        teacher,
        pristine,
        submitting,
        change,
        initialize,
    } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        showAllPublicTeachersService();
        showAllPublicSemestersService();
        initialize({
            semester,
            group,
            teacher,
        });
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <SemestersList handleSubmit={handleFormSubmit} />
            <GroupsList handleChange={change} />
            <TeachersList handleChange={change} />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={pristine || submitting}
            >
                <MdPlayArrow title={t(TEACHER_SCHEDULE_LABEL)} className="svg-btn" />
            </Button>
        </form>
    );
};

const mapStateToProps = (state) => ({
    semester: state.schedule.scheduleSemesterId,
    group: state.schedule.scheduleGroupId,
    teacher: state.schedule.scheduleTeacherId,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM,
    })(SchedulePageForm),
);
