import * as moment from 'moment';
import { connect } from 'react-redux';
import React, { useEffect, useState, useCallback } from 'react';
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
    greaterThanDate,
} from '../../validation/validateFields';
import { getClassScheduleListService } from '../../services/classService';
import { daysUppercase } from '../../constants/schedule/days';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { showAllGroupsService } from '../../services/groupService';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import { isObjectEmpty } from '../../helper/ObjectRevision';
import {
    COMMON_EDIT,
    COMMON_CREATE,
    COMMON_SEMESTER,
    COMMON_CURRENT_LABEL,
    COMMON_DEFAULT_LABEL,
    COMMON_YEAR_LABEL,
    COMMON_CHOOSE_GROUPS_BUTTON_LABEL,
    COMMON_SEMESTER_LABEL,
    COMMON_CLASS_FROM_LABEL,
    COMMON_CLASS_TO_LABEL,
    COMMON_DAYS_LABEL,
    COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE,
    COMMON_SAVE_BUTTON_LABEL,
} from '../../constants/translationLabels/common';
import { dateFormat } from '../../constants/formats';

const AddSemesterForm = (props) => {
    const prepSetCheckedClasses = {};
    // TODO move to utils
    const getToday = () => {
        return new Date();
    };
    const getTomorrow = () => {
        const tomorrow = new Date(getToday());
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };

    const [current, setCurrent] = useState(false);
    const [byDefault, setByDefault] = useState(false);
    const [startTime] = useState(getToday());
    const [finishTime, setFinishTime] = useState(getTomorrow());
    const [startValue, setStartValue] = useState();
    const [finishValue, setFinishValue] = useState();
    const [disabledFinishDate, setDisabledFinishDate] = useState(true);
    const [checkedDates, setCheckedDates] = useState({
        MONDAY: false,
        TUESDAY: false,
        WEDNESDAY: false,
        THURSDAY: false,
        FRIDAY: false,
        SATURDAY: false,
        SUNDAY: false,
    });
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
            SUNDAY: false,
        });
    };
    useEffect(() => {
        getClassScheduleListService();
        showAllGroupsService();
    }, []);

    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        onReset,
        submitting,
        semester,
        groups,
        selected,
        setSelected,
        selectedGroups,
        setSelectedGroups,
        classScheduler,
        change,
        initialize,
    } = props;
    const [openGroupDialog, setOpenGroupDialog] = useState(false);
    const getGroupOptions = (groupOptions) => {
        return groupOptions.map((item) => {
            return { id: item.id, value: item.id, label: `${item.title}` };
        });
    };
    useEffect(() => {
        const { semesterGroups } = semester;
        if (semesterGroups !== undefined && semesterGroups !== null) {
            setSelectedGroups(getGroupOptions(semesterGroups));
        }
    }, [semester.id]);

    const options = getGroupOptions(groups);
    const semesterOptions = getGroupOptions(groups.filter((x) => !selectedGroups.includes(x)));
    const openDialogForGroup = () => {
        setOpenGroupDialog(true);
    };
    const closeDialogForGroup = () => {
        setOpenGroupDialog(false);
    };
    const clearSelection = () => {
        setSelected([]);
    };
    const onCancel = () => {
        clearSelection();
        closeDialogForGroup();
    };

    const [checkedClasses, setCheckedClasses] = useState(prepSetCheckedClasses);
    useEffect(() => {
        classScheduler.forEach((classItem) => {
            prepSetCheckedClasses[`${classItem.id}`] = false;
        });
        setCheckedClasses({ ...prepSetCheckedClasses });
        clearCheckboxes();
    }, [classScheduler, semester.id]);

    const handleChange = (event, setState) => setState(event.target.checked);

    const setMinFinishDate = (time) => {
        const newDate = moment(time, dateFormat).add(1, 'd');
        return setFinishTime(newDate.toDate());
    };
    const setEndTime = (startTimeParam) => {
        if (disabledFinishDate || moment(startValue).isSameOrBefore(finishValue)) {
            setFinishValue(setMinFinishDate(startTimeParam));
            change('endDay', moment(startTimeParam, dateFormat).add(7, 'd').format(dateFormat));
        }
    };
    const setCheckedDaysHandler = useCallback(
        (day) => {
            return (event) => {
                const changedDay = { [day]: event.target.checked };
                setCheckedDates({
                    ...checkedDates,
                    ...changedDay,
                });
            };
        },
        [checkedDates],
    );
    const setCheckedClassesHandler = useCallback(
        (classid) => {
            return (event) => {
                const changedClass = { [classid]: event.target.checked };
                setCheckedClasses({
                    ...checkedClasses,
                    ...changedClass,
                });
            };
        },
        [checkedClasses],
    );

    const setSemesterClasses = () => {
        const classes = Object.keys(checkedClasses);
        return classes.map((classItem) => {
            const scheduleItem = classScheduler.find((schedule) => schedule.id === +classItem);
            return (
                <Field
                    key={semester.id + classItem}
                    name={`semester_classes_markup_${classItem}`}
                    label={`${scheduleItem.class_name} (${scheduleItem.startTime}-${scheduleItem.endTime})`}
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
        return days.map((semesterDay) => {
            return (
                <Field
                    key={semester.id + semesterDay}
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

        if (semester && semester.id) {
            semesterItem = {
                id: semester.id,
                year: semester.year,
                description: semester.description,
                startDay: semester.startDay,
                endDay: semester.endDay,
                currentSemester: semester.currentSemester,
                defaultSemester: semester.defaultSemester,
                semester_days: semester.semester_days,
                semester_classes: semester.semester_classes,
                semester_groups: semester.semester_groups,
            };

            daysUppercase.forEach((dayItem) => {
                if (semester.semester_days.includes(dayItem)) {
                    semesterItem[`semester_days_markup_${dayItem}`] = true;
                }
            });
            const newDays = semester.semester_days.reduce((result, day) => {
                const data = result;
                data[day] = true;
                return data;
            }, {});

            if (classScheduler) {
                classScheduler.forEach((classFullItem) => {
                    if (
                        semester.semester_classes.findIndex((classItem) => {
                            return classFullItem.id === classItem.id;
                        }) >= 0
                    ) {
                        semesterItem[`semester_classes_markup_${classFullItem.id}`] = true;
                    }
                });
            }

            const newClasses = semester.semester_classes.reduce((result, classItem) => {
                const data = result;
                data[classItem.id] = true;
                return data;
            }, {});

            setCurrent(semester.currentSemester);
            setByDefault(semester.defaultSemester);

            setCheckedDates({
                MONDAY: false,
                TUESDAY: false,
                WEDNESDAY: false,
                THURSDAY: false,
                FRIDAY: false,
                SATURDAY: false,
                SUNDAY: false,
                ...newDays,
            });

            const prepSetCheckedClassesNested = {};
            if (classScheduler) {
                classScheduler.forEach((classItem) => {
                    prepSetCheckedClassesNested[`${classItem.id}`] = false;
                });
            }
            setCheckedClasses({
                ...prepSetCheckedClassesNested,
                ...newClasses,
            });
        }
        initialize(semesterItem);
    }, [semester.id]);

    const getChosenSet = () => {
        const beginGroups = semester.semester_groups.map((item) => item.id);
        const resGroup = selectedGroups.map((item) => item.id);
        return resGroup.filter((x) => !beginGroups.includes(x));
    };
    const getChosenSetRemove = () => {
        const beginGroups = semester.semester_groups.map((item) => item.id);
        const resGroup = selectedGroups.map((item) => item.id);
        return beginGroups.filter((x) => !resGroup.includes(x));
    };
    const isChosenGroup = () => {
        const semesterCopy = { ...semester };
        if (semesterCopy.semester_groups.length < 0 || getChosenSet().length > 0) {
            return true;
        }
        return getChosenSetRemove().length > 0;
    };
    const getDisabledSaveButton = () => {
        if (!isObjectEmpty(semester) && semester.id !== null) {
            return (
                (selectedGroups.length > 0 ? !isChosenGroup() : selected.length === 0) &&
                (pristine || submitting)
            );
        }
        return pristine || submitting;
    };

    return (
        <Card additionClassName="form-card semester-form">
            <h2 style={{ textAlign: 'center' }}>
                {semester.id ? t(COMMON_EDIT) : t(COMMON_CREATE)}
                {` ${t(COMMON_SEMESTER)}`}
            </h2>
            {selectedGroups.length === 0 ? (
                <MultiselectForGroups
                    open={openGroupDialog}
                    options={options}
                    value={selected}
                    onChange={setSelected}
                    onCancel={onCancel}
                    onClose={closeDialogForGroup}
                />
            ) : (
                <MultiselectForGroups
                    open={openGroupDialog}
                    options={semesterOptions}
                    value={selectedGroups}
                    onChange={setSelectedGroups}
                    onCancel={onCancel}
                    onClose={closeDialogForGroup}
                />
            )}
            <form onSubmit={handleSubmit}>
                <div className="semester-checkbox group-options">
                    <div>
                        <Field
                            name="currentSemester"
                            label={t(COMMON_CURRENT_LABEL)}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={current}
                            onChange={(e) => handleChange(e, setCurrent)}
                            color="primary"
                        />
                        <Field
                            name="defaultSemester"
                            label={t(COMMON_DEFAULT_LABEL)}
                            labelPlacement="start"
                            component={renderCheckboxField}
                            checked={byDefault}
                            onChange={(e) => handleChange(e, setByDefault)}
                            color="primary"
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        onClick={openDialogForGroup}
                    >
                        {t(COMMON_CHOOSE_GROUPS_BUTTON_LABEL)}
                    </Button>
                </div>
                <Field
                    className="form-field"
                    name="year"
                    type="number"
                    component={renderTextField}
                    label={`${t(COMMON_YEAR_LABEL)}:`}
                    validate={[required, minYearValue]}
                />
                <Field
                    className="form-field"
                    name="description"
                    component={renderTextField}
                    label={`${t(COMMON_SEMESTER_LABEL)}:`}
                    validate={[required]}
                />
                <div className="form-time-block">
                    <Field
                        className="time-input"
                        name="startDay"
                        component={renderMonthPicker}
                        label={`${t(COMMON_CLASS_FROM_LABEL)}:`}
                        validate={[required, lessThanDate]}
                        minDate={startTime}
                        onChange={(event, value) => {
                            if (value) {
                                setStartValue(value);
                                setMinFinishDate(value);
                                setEndTime(value);
                                setDisabledFinishDate(false);
                            }
                        }}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={`${t(COMMON_CLASS_TO_LABEL)}:`}
                        validate={[required, greaterThanDate]}
                        minDate={finishTime}
                        disabled={disabledFinishDate}
                        onChange={(event, value) => {
                            setFinishValue(value);
                        }}
                    />
                </div>
                <div className="">
                    <p>{`${t(COMMON_DAYS_LABEL)}: `}</p>
                    {setSemesterDays()}
                </div>
                <div className="">
                    <p>{`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}</p>
                    {setSemesterClasses()}
                </div>
                <div className="form-buttons-container semester-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style "
                        disabled={getDisabledSaveButton()}
                        type="submit"
                    >
                        {t(COMMON_SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={
                            setDisableButton(pristine, submitting, semester.id) &&
                            selected.length === 0
                        }
                        onClick={() => {
                            onReset();
                            setSelected([]);
                        }}
                    >
                        {getClearOrCancelTitle(semester.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    semester: state.semesters.semester,
    classScheduler: state.classActions.classScheduler,
    groups: state.groups.groups,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: SEMESTER_FORM,
    })(AddSemesterForm),
);
