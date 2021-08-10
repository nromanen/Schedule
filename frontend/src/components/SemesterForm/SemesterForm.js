import * as moment from 'moment';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import './SemesterForm.scss';
import Card from '../../share/Card/Card';
import renderCheckboxField from '../../share/renderedFields/checkbox';
import { SEMESTER_FORM } from '../../constants/reduxForms';
import renderTextField from '../../share/renderedFields/input';
import renderMonthPicker from '../../share/renderedFields/timeSemester';
import {
    required,
    minYearValue,
    lessThanDate,
    greaterThanDate
} from '../../validation/validateFields';
import { getClassScheduleListService } from '../../services/classService';
import { daysUppercase } from '../../constants/schedule/days';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { showAllGroupsService } from '../../services/groupService';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import { useForm } from "react-hook-form";

let AddSemesterForm = props => {
    const clearCheckboxes = () => {
        setCurrent(false);
        setByDefault(false);
        setCheckedDates({
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
            SATURDAY: false,
            SUNDAY: false
        });
    };
    useEffect(() => getClassScheduleListService(), []);
    useEffect(()=>showAllGroupsService(),[])

    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, onReset, submitting,semester,groups,selected,setSelected,selectedGroups,setSelectedGroups } = props;
    const [openGroupDialog,setOpenGroupDialog]=useState(false);
    useEffect(()=>{
        if(semester.semester_groups!==undefined){
            setSelectedGroups(getGroupOptions(semester.semester_groups))
        }
    },[semester.id])
    const getGroupOptions=(groupOptions)=>{

        return groupOptions.map(item=>{return {id:item.id,value:item.id,label:`${item.title}`}});
    }
    const options=getGroupOptions(groups);
    const semesterOptions=getGroupOptions(groups.filter(x => !selectedGroups.includes(x)));
    const openDialogForGroup = () => {
      setOpenGroupDialog(true)
    }
    const closeDialogForGroup = () => {
        setOpenGroupDialog(false)
    }
    const clearSelection = () => {
      setSelected([])
    }
    const onCancel = () => {
      clearSelection();
      closeDialogForGroup();
    }

    const onClose = () => {
        closeDialogForGroup();
    }
    const onSubmit = (values) => {
        console.log(values)
        handleSubmit(values);
    }
    const { setValue } = useForm();

    let prepSetCheckedClasses = {};
    useEffect(() => {
        props.classScheduler.forEach(classItem => {
            prepSetCheckedClasses[`${classItem.id}`] = false;
        });
        setCheckedClasses({ ...prepSetCheckedClasses });
        clearCheckboxes();
    }, [props.classScheduler, props.semester.id]);

    const [current, setCurrent] = React.useState(false);
    const [byDefault, setByDefault] = React.useState(false);

    const [checkedDates, setCheckedDates] = React.useState({
        MONDAY: false,
        TUESDAY: false,
        WEDNESDAY: false,
        THURSDAY: false,
        FRIDAY: false,
        SATURDAY: false,
        SUNDAY: false
    });

    const [checkedClasses, setCheckedClasses] = React.useState(
        prepSetCheckedClasses
    );

    const handleChange = (event,setState) => setState(event.target.checked);

    const setEndTime = startTime =>
        props.change(
            'endDay',
            moment(startTime, 'DD/MM/YYYY').add(7, 'd').format('DD/MM/YYYY')
        );

    const setCheckedDaysHandler = React.useCallback(
        day => {
            return function (event) {
                let changedDay = { [day]: event.target.checked };
                setCheckedDates({
                    ...checkedDates,
                    ...changedDay
                });
            };
        },
        [checkedDates]
    );
    const setCheckedClassesHandler = React.useCallback(
        classid => {
            return function (event) {
                let changedClass = { [classid]: event.target.checked };
                setCheckedClasses({
                    ...checkedClasses,
                    ...changedClass
                });
            };
        },
        [checkedClasses]
    );

    const setSemesterClasses = () => {
        const classes = Object.keys(checkedClasses);
        return classes.map(classItem => {
            const scheduleItem = props.classScheduler.find(
                schedule => schedule.id === +classItem
            );
            return (
                <Field
                    key={props.semester.id + classItem}
                    name={`semester_classes_markup_${classItem}`}
                    label={
                        scheduleItem.class_name +
                        ' (' +
                        scheduleItem.startTime +
                        '-' +
                        scheduleItem.endTime +
                        ')'
                    }
                    labelPlacement="end"
                    component={renderCheckboxField}
                    defaultValue={checkedClasses[classItem]}
                    checked={checkedClasses[classItem]}
                    onChange={setCheckedClassesHandler(classItem)}
                    color="primary"
                />
            );
        });
    };
    const setSemesterDays = () => {
        const days = Object.keys(checkedDates);
        return days.map(semesterDay => {
            return (
                <Field
                    key={props.semester.id + semesterDay}
                    name={`semester_days_markup_${semesterDay}`}
                    label={t(`common:day_of_week_${semesterDay}`)}
                    labelPlacement="end"
                    defaultValue={checkedDates[semesterDay]}
                    component={renderCheckboxField}
                    checked={checkedDates[semesterDay]}
                    onChange={setCheckedDaysHandler(semesterDay)}
                    color="primary"
                />
            );
        });
    };

    useEffect(() => {
        let semesterItem = {};
        clearCheckboxes();

        if (props.semester) {
            if (props.semester.id) {
                semesterItem = {
                    id: props.semester.id,
                    year: props.semester.year,
                    description: props.semester.description,
                    startDay: props.semester.startDay,
                    endDay: props.semester.endDay,
                    currentSemester: props.semester.currentSemester,
                    defaultSemester:props.semester.defaultSemester,
                    semester_days: props.semester.semester_days,
                    semester_classes: props.semester.semester_classes,
                    semester_groups:props.semester.semester_groups

                };

                daysUppercase.forEach(dayItem => {
                    if (props.semester.semester_days.includes(dayItem)) {
                        semesterItem[`semester_days_markup_${dayItem}`] = true;
                    }
                });
                const newDays = props.semester.semester_days.reduce(
                    (result, day) => {
                        result[day] = true;
                        return result;
                    },
                    {}
                );

                if (props.classScheduler) {
                    props.classScheduler.forEach(classFullItem => {
                        if (
                            props.semester.semester_classes.findIndex(
                                classItem => {
                                    return classFullItem.id === classItem.id;
                                }
                            ) >= 0
                        ) {
                            semesterItem[
                                `semester_classes_markup_${classFullItem.id}`
                            ] = true;
                        }
                    });
                }

                const newClasses = props.semester.semester_classes.reduce(
                    (result, classItem) => {
                        result[classItem.id] = true;
                        return result;
                    },
                    {}
                );

                setCurrent(props.semester.currentSemester);
                setByDefault(props.semester.defaultSemester);

                setCheckedDates({
                    MONDAY: false,
                    TUESDAY: false,
                    WEDNESDAY: false,
                    THURSDAY: false,
                    FRIDAY: false,
                    SATURDAY: false,
                    SUNDAY: false,
                    ...newDays
                });

                let prepSetCheckedClasses = {};
                if (props.classScheduler) {
                    props.classScheduler.forEach(classItem => {
                        prepSetCheckedClasses[`${classItem.id}`] = false;
                    });
                }
                setCheckedClasses({
                    ...prepSetCheckedClasses,
                    ...newClasses
                });
            }
        }
        props.initialize(semesterItem);
    }, [props.semester.id]);

    return (

        <Card class="form-card semester-form">
            <h2 style={{ textAlign: 'center' }}>
                {props.semester.id ? t('edit_title') : t('create_title')}
                {t('semestry_label')}
            </h2>
            {selectedGroups.length===0?
            <MultiselectForGroups
                open={openGroupDialog}
                options={options}
                value={selected}
                onChange={setSelected}
                onCancel={onCancel}
                onClose={onClose}
            />:
                <MultiselectForGroups
                    open={openGroupDialog}
                    options={semesterOptions}
                    value={selectedGroups}
                    onChange={setSelectedGroups}
                    onCancel={onCancel}
                    onClose={onClose}
                />}
            <form onSubmit={onSubmit}>
                <div className="semester-checkbox group-options">
                    <div>
                        <Field
                            name="currentSemester"
                            label={t('common:current_label')}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={current}
                            onChange={(e)=>handleChange(e,setCurrent)}
                            color="primary"
                        />
                        <Field
                            name="defaultSemester"
                            label={t('common:default_label')}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={byDefault}
                            onChange={(e)=>handleChange(e,setByDefault)}
                            color="primary"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        onClick={openDialogForGroup}
                    >
                        {t('choose_groups_button_label')}
                    </Button>
                </div>
                <Field
                    className="form-field"
                    name="year"
                    type="number"
                    component={renderTextField}
                    label={t('year_label') + ':'}
                    validate={[required, minYearValue]}
                />
                <Field
                    className="form-field"
                    name="description"
                    component={renderTextField}
                    label={t('semester_label') + ':'}
                    validate={[required]}
                />
                <div className="form-time-block">
                    <Field
                        className="time-input"
                        name="startDay"
                        component={renderMonthPicker}
                        label={t('class_from_label') + ':'}
                        validate={[required, lessThanDate]}
                        onChange={(event, value) => {
                            if (value) {
                                setEndTime(value);
                            }
                        }}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={t('class_to_label') + ':'}
                        validate={[required, greaterThanDate]}
                    />
                </div>
                <div className="">
                    <p>{t('common:days_label') + ': '}</p>
                    {setSemesterDays()}
                </div>
                <div className="">
                    <p>{t('common:ClassSchedule_management_title') + ': '}</p>
                    {setSemesterClasses()}
                </div>
                <div className="form-buttons-container semester-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t('save_button_label')}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={setDisableButton(pristine,submitting,semester.id)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(semester.id,t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = state => ({
    classScheduler: state.classActions.classScheduler,
    groups:state.groups.groups,

});

export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_FORM
    })(AddSemesterForm)
);

