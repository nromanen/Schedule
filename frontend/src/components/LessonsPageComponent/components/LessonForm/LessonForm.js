import React, { useEffect } from 'react';

import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Card from '../../../../share/Card/Card';

import renderTextField from '../../../../share/renderedFields/input';
import SelectField from '../../../../share/renderedFields/select';
import renderCheckboxField from '../../../../share/renderedFields/checkbox';

import { LESSON_FORM } from '../../../../constants/reduxForms';
import './LessonForm.scss';
import { lessThanZero, maxLengthValue, required } from '../../../../validation/validateFields';
import { setUniqueErrorService, selectLessonCardService } from '../../../../services/lessonService';
import { handleTeacherInfo } from '../../../../helper/renderTeacher';
import { setValueToSubjectForSiteHandler } from '../../../../helper/reduxFormHelper';
import { getClearOrCancelTitle, setDisableButton } from '../../../../helper/disableComponent';
import { selectGroupService } from '../../../../services/groupService';
import { RenderMultiselect } from '../../../../share/renderedFields/renderMultiselect';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    GROUP_LABEL,
    SUBJECT_LABEL,
    LESSON_LABEL,
    NOT_SELECTED_LABEL,
    GROUPS_LABEL,
    COPY_GROUPS_LABEL,
    COPY_FOR_BUTTON_LABEL,
    LINK_TO_MEETING_LABEL,
    FOR_SITE_LABEL,
    FORM_GROUPED_LABEL,
    HOURS_LABEL,
    TEACHER_LABEL,
} from '../../../../constants/translationLabels/formElements';
import { TYPE_LABEL } from '../../../../constants/translationLabels/common';

const useStyles = makeStyles(() => ({
    notSelected: {
        '&': {
            textAlign: 'center',
            margin: 'auto',
        },
    },
}));

let LessonForm = (props) => {
    const { t } = useTranslation('formElements');

    const {
        handleSubmit,
        pristine,
        reset,
        submitting,
        groups,
        group,
        lesson,
        isUniqueError,
        teachers,
        subjects,
        groupId,
        initialize,
        change,
        lessonTypes,
    } = props;

    const classes = useStyles();
    const lessonId = lesson.id;

    const [checked, setChecked] = React.useState(false);

    const initializeFormHandler = (lessonData) => {
        const {
            id: lessonCardId,
            teacher,
            subject,
            lessonType: type,
            hours,
            linkToMeeting,
            subjectForSite,
            grouped,
        } = lessonData;
        initialize({
            lessonCardId,
            teacher: teacher.id,
            subject: subject.id,
            type,
            hours,
            linkToMeeting,
            subjectForSite,
            grouped,
            groups: [group],
        });
        setChecked(lessonData.grouped);
    };
    const handleChange = (event) => setChecked(event.target.checked);

    useEffect(() => {
        selectGroupService(groupId);
    }, [groupId]);

    useEffect(() => {
        setChecked(false);
        if (lessonId) {
            initializeFormHandler(lesson);
        } else {
            initialize();
        }
    }, [lessonId]);

    return (
        <Card additionClassName="form-card">
            {groupId && (
                <h2 className="form-title under-line">
                    {lessonId ? t(EDIT_TITLE) : t(CREATE_TITLE)}
                    {t(LESSON_LABEL)}
                </h2>
            )}
            {groupId ? (
                <form onSubmit={handleSubmit}>
                    <Field
                        id="teacher"
                        name="teacher"
                        className="form-field"
                        component={SelectField}
                        label={t(TEACHER_LABEL)}
                        {...(!isUniqueError ? { validate: [required] } : { error: isUniqueError })}
                        onChange={() => setUniqueErrorService(false)}
                    >
                        <option />
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {handleTeacherInfo(teacher)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        id="subject"
                        name="subject"
                        className="form-field"
                        component={SelectField}
                        label={t(SUBJECT_LABEL)}
                        {...(!isUniqueError ? { validate: [required] } : { error: isUniqueError })}
                        onChange={(event) => {
                            setValueToSubjectForSiteHandler(subjects, event.target.value, change);
                            setUniqueErrorService(false);
                        }}
                    >
                        <option value="" />
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </Field>
                    <div className="form-fields-container">
                        <Field
                            id="type"
                            name="type"
                            className="form-field"
                            component={SelectField}
                            label={t(TYPE_LABEL)}
                            {...(!isUniqueError
                                ? { validate: [required] }
                                : { error: isUniqueError })}
                            onChange={() => {
                                setUniqueErrorService(false);
                            }}
                        >
                            <option value="" />
                            {lessonTypes.map((lessonType) => (
                                <option value={lessonType} key={lessonType}>
                                    {t(
                                        `formElements:lesson_type_${lessonType.toLowerCase()}_label`,
                                    )}
                                </option>
                            ))}
                        </Field>
                        <Field
                            id="hours"
                            name="hours"
                            className="form-field"
                            type="number"
                            component={renderTextField}
                            label={t(HOURS_LABEL)}
                            validate={[required, lessThanZero]}
                        />
                        <Field
                            id="grouped"
                            name="grouped"
                            className="form-field"
                            label={t(FORM_GROUPED_LABEL)}
                            labelPlacement="end"
                            defaultValue={checked}
                            component={renderCheckboxField}
                            checked={checked}
                            onChange={handleChange}
                            color="primary"
                        />
                    </div>
                    <Field
                        id="linkToMeeting"
                        name="linkToMeeting"
                        className="form-field"
                        rowsMax="1"
                        margin="normal"
                        component={renderTextField}
                        label={t(LINK_TO_MEETING_LABEL)}
                        validate={[maxLengthValue]}
                        type="url"
                        placeholder="Input URL"
                    />
                    <Field
                        id="subjectForSite"
                        name="subjectForSite"
                        className="form-field"
                        multiline
                        rowsMax="1"
                        margin="normal"
                        component={renderTextField}
                        label={t(SUBJECT_LABEL) + t(FOR_SITE_LABEL)}
                        validate={[required, maxLengthValue]}
                    />
                    {!lessonId && (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>{t(COPY_FOR_BUTTON_LABEL)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    <>
                                        <p className="group-label">
                                            <label htmlFor="groups">{t(COPY_GROUPS_LABEL)}</label>
                                        </p>
                                        <Field
                                            id="groups"
                                            name="groups"
                                            component={RenderMultiselect}
                                            options={groups}
                                            displayValue="title"
                                            className="form-control mt-2"
                                            placeholder={t(GROUPS_LABEL)}
                                            hidePlaceholder
                                            selectedValues={[group]}
                                            alwaysDisplayedItem={group}
                                        />
                                    </>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    <div className="form-buttons-container">
                        <Button
                            className="buttons-style"
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={pristine || submitting}
                            onClick={() => {
                                setChecked(false);
                            }}
                        >
                            {t(SAVE_BUTTON_LABEL)}
                        </Button>
                        <Button
                            className="buttons-style"
                            type="button"
                            variant="contained"
                            disabled={setDisableButton(pristine, submitting, lesson.id)}
                            onClick={() => {
                                reset();
                                setUniqueErrorService(null);
                                selectLessonCardService(null);
                            }}
                        >
                            {getClearOrCancelTitle(lesson.id, t)}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className={classes.notSelected}>
                    <h2>{`${t(GROUP_LABEL)} ${t(NOT_SELECTED_LABEL)}`}</h2>
                </div>
            )}
        </Card>
    );
};

const mapStateToProps = (state) => ({
    lesson: state.lesson.lesson,
    groups: state.groups.groups,
    group: state.groups.group,
    isUniqueError: state.lesson.uniqueError,
    groupId: state.lesson.groupId,
    subjects: state.subjects.subjects,
    lessonTypes: state.lesson.lessonTypes,
    teachers: state.teachers.teachers,
    currentSemester: state.schedule.currentSemester,
});

LessonForm = reduxForm({
    form: LESSON_FORM,
})(LessonForm);

export default connect(mapStateToProps)(LessonForm);
