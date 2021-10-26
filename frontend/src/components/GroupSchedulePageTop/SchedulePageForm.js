import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MdPlayArrow } from 'react-icons/md';
import { TEACHER_SCHEDULE_LABEL } from '../../constants/translationLabels/common';
import { showAllPublicSemestersService } from '../../services/scheduleService';
import GroupsList from '../../containers/GroupSchedulePageTop/GroupsList';
import SemestersList from '../../containers/GroupSchedulePageTop/SemestersList';
import TeachersList from '../../containers/GroupSchedulePageTop/TeachersList';
import { getAllPublicTeachersRequested } from '../../actions/schedule';

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
        getAllPublicTeachers,
    } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        getAllPublicTeachers();
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

const mapDispatchToProps = (dispatch) => ({
    getAllPublicTeachers: () => dispatch(getAllPublicTeachersRequested()),
});

export default connect(null, mapDispatchToProps)(SchedulePageForm);
