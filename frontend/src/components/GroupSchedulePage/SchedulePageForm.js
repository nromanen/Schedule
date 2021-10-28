import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdPlayArrow } from 'react-icons/md';
import { TEACHER_SCHEDULE_LABEL } from '../../constants/translationLabels/common';
import GroupsList from '../../containers/GroupSchedulePage/GroupsList';
import SemestersList from '../../containers/GroupSchedulePage/SemestersList';
import TeachersList from '../../containers/GroupSchedulePage/TeachersList';

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
        getAllPublicSemesters,
    } = props;
    const { t } = useTranslation('common');
    useEffect(() => {
        getAllPublicTeachers();
        getAllPublicSemesters();
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

export default SchedulePageForm;
