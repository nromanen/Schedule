import React, { useEffect } from 'react';

import Card from '../../share/Card/Card';

import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import renderTextField from '../../share/renderedFields/input';
import renderSelectField from '../../share/renderedFields/select';
import renderCheckboxField from '../../share/renderedFields/checkbox';

import { FaUserPlus } from 'react-icons/fa';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { LESSON_FORM } from '../../constants/reduxForms';
import './LessonForm.scss'
import {
    lessThanZero,
    maxLengthValue,
    required
} from '../../validation/validateFields';
import { useTranslation } from 'react-i18next';
import { setUniqueErrorService } from '../../services/lessonService';
import {handleTeacherInfo } from '../../helper/renderTeacher';
import {
    setValueToSubjectForSiteHandler
} from '../../helper/reduxFormHelper';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { selectGroupService } from '../../services/groupService';
import { RenderMultiselect, renderMultiselect } from '../../share/renderedFields/renderMultiselect';

const useStyles = makeStyles(() => ({
    notSelected: {
        '&': {
            textAlign: 'center',
            margin: 'auto'
        }
    }
}));

let LessonForm = props => {
    const { t } = useTranslation('formElements');

    const { handleSubmit, pristine, reset, submitting,groups,group } = props;

    const classes = useStyles();

    const lesson = props.lesson;
    const lessonId = lesson.id;

    const isUniqueError = props.isUniqueError;

    const teachers = props.teachers;

    const subjects = props.subjects;

    const groupId = props.groupId;

    const [checked, setChecked] = React.useState(false);
    const handleChange = event => setChecked(event.target.checked);
    useEffect(()=>{
        selectGroupService(groupId)
    },groupId)
    useEffect(() => {
        setChecked(false);
        if (lessonId) {
            initializeFormHandler(lesson);
        } else {
            props.initialize();
        }
    }, [lessonId]);

    const initializeFormHandler = lesson => {
        props.initialize({
            lessonCardId: lesson.id,
            teacher: lesson.teacher.id,
            subject: lesson.subject.id,
            type: lesson.lessonType,
            hours: lesson.hours,
            linkToMeeting:lesson.linkToMeeting,
            subjectForSite: lesson.subjectForSite,
            grouped: lesson.grouped,
            groups:[group]
        });
        setChecked(lesson.grouped);
    };

    return (
        <Card class="form-card">
            {groupId ? (
                <h2 className="form-title under-line">
                    {lessonId ? t('edit_title') : t('create_title')}
                    {t('lesson_label')}
                </h2>
            ) : (
                ''
            )}
            {groupId ? (
                <form onSubmit={handleSubmit}>
                    <Field
                        id="teacher"
                        name="teacher"
                        className="form-field"
                        component={renderSelectField}
                        label={t('teacher_label')}
                        {...(!isUniqueError
                            ? { validate: [required] }
                            : { error: isUniqueError })}
                        onChange={()=>
                            setUniqueErrorService(false)
                        }
                    >
                        <option />
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {handleTeacherInfo(teacher)}
                            </option>
                        ))}
                    </Field>
                    <Field
                        id="subject"
                        name="subject"
                        className="form-field"
                        component={renderSelectField}
                        label={t('subject_label')}
                        {...(!isUniqueError
                            ? { validate: [required] }
                            : { error: isUniqueError })}
                        onChange={event => {
                            setValueToSubjectForSiteHandler(
                                subjects,
                                event.target.value,
                                props.change
                            );
                            setUniqueErrorService(false);
                        }}
                    >
                        <option value={''} />
                        {subjects.map(subject => (
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
                            component={renderSelectField}
                            label={t('type_label')}
                            {...(!isUniqueError
                                ? { validate: [required] }
                                : { error: isUniqueError })}
                            onChange={() => {
                                setUniqueErrorService(false);
                            }}
                        >
                            <option value={''} />
                            {props.lessonTypes.map((lessonType, index) => (
                                <option value={lessonType} key={index}>
                                    {t(
                                        `formElements:lesson_type_${lessonType.toLowerCase()}_label`
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
                            label={t('hours_label')}
                            validate={[required, lessThanZero]}
                        />
                        <Field
                            id="grouped"
                            name="grouped"
                            className="form-field"
                            label={
                                <FaUserPlus
                                    title={t('formElements:grouped_label')}
                                    className="svg-btn copy-btn align-left info-btn"
                                />
                            }
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
                        label={t('link_to_meeting_label')}
                        validate={[required, maxLengthValue]}
                        type="url"
                        placeholder={"Input URL"}
                    />
                    <Field
                        id="subjectForSite"
                        name="subjectForSite"
                        className="form-field"
                        multiline
                        rowsMax="1"
                        margin="normal"
                        component={renderTextField}
                        label={t('subject_label') + t('for_site_label')}
                        validate={[required, maxLengthValue]}
                    />
                    <Field
                        id="groups"
                        name="groups"
                        component={RenderMultiselect}
                        options={groups}
                        displayValue={"title"}
                        className="form-control mt-2"
                        placeholder={t('groups_label')}
                        hidePlaceholder={true}
                        selectedValues={[group]}
                        alwaysDisplayedItem={group}

                    />

                    <div className="form-buttons-container">
                        <Button
                            className="buttons-style"
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={pristine || submitting}
                        >
                            {t('save_button_label')}
                        </Button>
                        <Button
                            className="buttons-style"
                            type="button"
                            variant="contained"
                            disabled={setDisableButton(pristine,submitting,lesson.id)}
                            onClick={() => {
                                reset();
                                setUniqueErrorService(null);
                                props.onSetSelectedCard(null);
                            }}
                        >
                            {getClearOrCancelTitle(lesson.id,t)}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className={classes.notSelected}>
                    <h2>{t('group_label') + ' ' + t('not_selected_label')}</h2>
                </div>
            )}
        </Card>
    );
};

const mapStateToProps = state => (
    {
        lesson: state.lesson.lesson,
        groups:state.groups.groups,
        group:state.groups.group
    });

LessonForm = reduxForm({
    form: LESSON_FORM
})(LessonForm);

export default connect(mapStateToProps)(LessonForm);
