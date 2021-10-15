import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { isEmpty } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import { MdPlayArrow } from 'react-icons/md';

import { MenuItem, Select } from '@material-ui/core';
import SelectField from '../../share/renderedFields/select';

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

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const GroupSchedulePageTop = (props) => {
    const [groupDisabled, setGroupDisabled] = useState(true);
    const { root } = useStyles();
    const { t } = useTranslation('common');
    const {
        groups,
        teachers,
        semesters,
        handleSubmit,
        changePlace,
        pristine,
        submitting,
        place,
        initialize,
        initialValues,
        change,
    } = props;
    const [semesterId, setSemesterId] = useState(initialValues.semester);

    useEffect(() => {
        showAllPublicTeachersService();
        showAllPublicSemestersService();
        initialize({
            semester: initialValues.semester,
            group: initialValues.group,
            teacher: initialValues.teacher,
        });
    }, []);
    useEffect(() => showAllPublicGroupsService(semesterId), [semesterId]);
    useEffect(() => setGroupDisabled(isEmpty(groups)), [groups]);

    const renderSemesterList = () => {
        if (!isEmpty(semesters)) {
            return (
                <Field
                    id="semester"
                    name="semester"
                    component={SelectField}
                    label={t('formElements:semester_label')}
                    type="text"
                    validate={[required]}
                    onChange={(e) => setSemesterId(e.target.value)}
                >
                    {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id} className="option-item">
                            {semester.description}
                        </option>
                    ))}
                </Field>
            );
        }
        return null;
    };
    const renderTeacherList = () => {
        return (
            <Field
                id="teacher"
                name="teacher"
                component={SelectField}
                label={t('formElements:teacher_label')}
                type="text"
                onChange={() => {
                    change('group', 0);
                }}
            >
                <option className="option-item" value={null} />
                {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id} className="option-item">
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
                component={SelectField}
                label={t('formElements:group_label')}
                type="text"
                onChange={() => {
                    change('teacher', 0);
                }}
            >
                <option className="option-item" value={null} />
                {groups.map((group) => (
                    <option key={group.id} value={group.id} className="option-item">
                        {group.title}
                    </option>
                ))}
            </Field>
        );
    };

    return (
        <section className={root}>
            <p>{t('greetings_schedule_message')}</p>
            <p>{t('greetings_schedule_message_hint')}</p>
            <section className="form-buttons-container top">
                <Card additionClassName="form-card width-auto">
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
                            <MdPlayArrow title={t('teacher_schedule_label')} className="svg-btn" />
                        </Button>
                    </form>
                </Card>
                <span id="select-place">
                    <label htmlFor="demo-controlled-open-select">
                        {t('place_for_class_label')}
                    </label>
                    <Select
                        className="place"
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={place}
                        onChange={changePlace}
                    >
                        {Object.entries(places).map((placeItem) => (
                            <MenuItem value={placeItem[1]} key={placeItem[0]}>
                                {t(`${placeItem[1]}_label`)}
                            </MenuItem>
                        ))}
                    </Select>
                </span>
            </section>
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
