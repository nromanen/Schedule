import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import { MdPlayArrow } from 'react-icons/md';
import { isEmpty } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MenuItem, Select } from '@material-ui/core';
import renderSelectField from '../../share/renderedFields/select';

import {
    showAllPublicSemestersService,
    showAllPublicGroupsService,
    showAllPublicTeachersService,
} from '../../services/scheduleService';

import './GroupSchedulePageTop.scss';
import Card from '../../share/Card/Card';

import { SCHEDULE_SEARCH_FORM } from '../../constants/reduxForms';
import { required } from '../../validation/validateFields';
import { places } from '../../constants/places';
import { getTeacherFullName } from '../../helper/renderTeacher';
import {
    FORM_SEMESTER_LABEL,
    FORM_TEACHER_LABEL,
    FORM_GROUP_LABEL,
} from '../../constants/translationLabels/formElements';
import {
    GREETING_SCHEDULE_MESSAGE,
    GREETING_SCHEDULE_MESSAGE_HINT,
    TEACHER_SCHEDULE_LABEL,
    PLACE_FOR_CLASS_LABEL,
} from '../../constants/translationLabels/common';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const GroupSchedulePageTop = (props) => {
    const [groupDisabled, setGroupDisabled] = useState(true);
    const classes = useStyles();
    const { t } = useTranslation('common');
    const { groups, teachers, semesters, handleSubmit, pristine, submitting } = props;
    const isLoading = props.loading;
    const [semesterId, setSemesterId] = useState(props.initialValues.semester);
    let loadingContainer = '';
    if (isLoading) {
        loadingContainer = (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }
    useEffect(() => showAllPublicGroupsService(semesterId), [semesterId]);
    useEffect(() => showAllPublicTeachersService(), []);
    useEffect(() => showAllPublicSemestersService(), []);
    useEffect(() => {
        if (!isEmpty(groups)) {
            setGroupDisabled(false);
        } else {
            setGroupDisabled(true);
        }
    }, [groups]);
    const renderSemesterList = () => {
        if (semesters && semesters.length > 1) {
            return (
                <Field
                    id="semester"
                    name="semester"
                    component={renderSelectField}
                    label={t(FORM_SEMESTER_LABEL)}
                    type="text"
                    validate={[required]}
                    onChange={(e) => setSemesterId(e.target.value)}
                >
                    <option />
                    {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                            {semester.description}
                        </option>
                    ))}
                </Field>
            );
        }
        if (semesters && semesters.length === 1) {
            handleSubmit({ semester: semesters[0].id });
            return <p>{semesters[0].description}</p>;
        }
        return null;
    };
    const renderTeacherList = () => {
        return (
            <Field
                id="teacher"
                name="teacher"
                component={renderSelectField}
                label={t(FORM_TEACHER_LABEL)}
                type="text"
                onChange={() => props.change('group', 0)}
            >
                <option />
                {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                        {getTeacherFullName(teacher)}
                    </option>
                ))}
            </Field>
        );
    };
    const renderGroupList = () => {
        return (
            <Field
                disabled={groupDisabled}
                id="group"
                name="group"
                component={renderSelectField}
                label={t(FORM_GROUP_LABEL)}
                type="text"
                onChange={() => {
                    props.change('teacher', 0);
                }}
            >
                <option />
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.title}
                    </option>
                ))}
            </Field>
        );
    };

    useEffect(() => {
        props.initialize({
            semester: props.initialValues.semester,
            group: props.initialValues.group,
            teacher: props.initialValues.teacher,
        });
    }, []);

    return (
        <section className={classes.root}>
            <p>{t(GREETING_SCHEDULE_MESSAGE)}</p>
            <p>{t(GREETING_SCHEDULE_MESSAGE_HINT)}</p>
            <section className="form-buttons-container top">
                <Card class="form-card width-auto">
                    <form onSubmit={handleSubmit}>
                        {renderSemesterList()}
                        {renderGroupList()}
                        {renderTeacherList()}

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={pristine || submitting}
                        >
                            <MdPlayArrow title={t(TEACHER_SCHEDULE_LABEL)} className="svg-btn" />
                        </Button>
                    </form>
                </Card>
                <span id="select-place">
                    <label htmlFor="demo-controlled-open-select">{t(PLACE_FOR_CLASS_LABEL)}</label>
                    <Select
                        className="place"
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={props.place}
                        onChange={props.onChange}
                    >
                        {Object.entries(places).map((data) => {
                            return (
                                <MenuItem value={data[1]} key={data[0]}>
                                    {t(`${data[1]}_label`)}
                                </MenuItem>
                            );
                        }, this)}
                    </Select>
                </span>
            </section>
            {loadingContainer}
        </section>
    );
};

const mapStateToProps = (state) => ({
    defaultSemester: state.schedule.defaultSemester,
    groups: state.groups.groups,
    teachers: state.teachers.teachers,
    semesters: state.schedule.semesters,
    loading: state.loadingIndicator.loading,
    initialValues: {
        semester: state.schedule.scheduleSemesterId,
        group: state.schedule.scheduleGroupId,
        teacher: state.schedule.scheduleTeacherId,
    },
});
export default connect(mapStateToProps)(
    reduxForm({
        form: SCHEDULE_SEARCH_FORM,
    })(GroupSchedulePageTop),
);
