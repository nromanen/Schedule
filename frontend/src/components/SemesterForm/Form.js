import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import './SemesterForm.scss';
import renderCheckboxField from '../../share/renderedFields/checkbox';
import renderTextField from '../../share/renderedFields/input';
import renderMonthPicker from '../../share/renderedFields/timeSemester';
import {
    required,
    minYearValue,
    lessThanDate,
    greaterThanDate,
} from '../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
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
import { SEMESTER_FORM } from '../../constants/reduxForms';
import { daysUppercase } from '../../constants/schedule/days';
import { dateFormat } from '../../constants/formats';
import { getToday, getTomorrow } from '../../utils/formUtils';

const weekDays = {
    MONDAY: false,
    TUESDAY: false,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
    SUNDAY: false,
};

const createClasslabel = (classScheduler, classItem) => {
    const item = classScheduler.find((schedule) => schedule.id === +classItem);
    return `${item.class_name} (${item.startTime}-${item.endTime})`;
};
const Form = (props) => {
    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        onReset,
        submitting,
        semester,
        selected,
        setSelected,
        openDialogForGroup,
        getDisabledSaveButton,
        classScheduler,
        initialize,
        change,
    } = props;
    const prepSetCheckedClasses = {};
    const [startValue, setStartValue] = useState();
    const [finishValue, setFinishValue] = useState();
    const [checkedClasses, setCheckedClasses] = useState(prepSetCheckedClasses);
    const [checkedDates, setCheckedDates] = useState(weekDays);
    const [current, setCurrent] = useState(false);
    const [byDefault, setByDefault] = useState(false);
    const [startTime] = useState(getToday());
    const [finishTime, setFinishTime] = useState(getTomorrow());
    const [disabledFinishDate, setDisabledFinishDate] = useState(true);

    const clearCheckboxes = () => {
        classScheduler.forEach((classItem) => {
            prepSetCheckedClasses[`${classItem.id}`] = false;
        });
        setCheckedClasses({ ...prepSetCheckedClasses });
        setCurrent(false);
        setByDefault(false);
        setCheckedDates(weekDays);
    };

    useEffect(() => {
        console.log('semester', semester);
        let semesterItem = {};
        clearCheckboxes();

        if (semester.id) {
            semesterItem = semester;
            semesterItem.semester_days.forEach((item) => {
                semesterItem[`semester_days_markup_${item}`] = true;
            });
            const newDays = semester.semester_days.reduce((result, day) => {
                const data = result;
                data[day] = true;
                return data;
            }, {});

            setCheckedDates({
                ...weekDays,
                ...newDays,
            });

            classScheduler.forEach((classFullItem) => {
                if (
                    semester.semester_classes.findIndex((classItem) => {
                        return classFullItem.id === classItem.id;
                    }) >= 0
                ) {
                    semesterItem[`semester_classes_markup_${classFullItem.id}`] = true;
                }
            });

            const newClasses = semester.semester_classes.reduce((result, classItem) => {
                const data = result;
                data[classItem.id] = true;
                return data;
            }, {});

            setCurrent(semester.currentSemester);
            setByDefault(semester.defaultSemester);

            const prepSetCheckedClassesNested = {};
            classScheduler.forEach((classItem) => {
                prepSetCheckedClassesNested[`${classItem.id}`] = false;
            });

            setCheckedClasses({
                ...prepSetCheckedClassesNested,
                ...newClasses,
            });
        }
        initialize(semesterItem);
    }, [classScheduler, semester.id]);

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
    const setCheckedHandler = (event, day, checked, setSchecked) => {
        const changedDay = { [day]: event.target.checked };
        setSchecked({
            ...checked,
            ...changedDay,
        });
    };

    const setSemesterCheckboxes = (checked, method, name) => {
        const classes = Object.keys(checked);
        return classes.map((item) => {
            return (
                <Field
                    key={semester.id + item}
                    name={`${name}${item}`}
                    label={
                        name.indexOf('semester_days_markup_') >= 0
                            ? t(`common:day_of_week_${item}`)
                            : createClasslabel(classScheduler, item)
                    }
                    labelPlacement="end"
                    component={renderCheckboxField}
                    defaultValue={checked[item]}
                    checked={checked[item]}
                    onChange={(e) => {
                        setCheckedHandler(e, item, checked, method);
                    }}
                    color="primary"
                />
            );
        });
    };

    const handleChange = (event, setState) => setState(event.target.checked);
    return (
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
                    onChange={(_, value) => {
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
                    onChange={(_, value) => {
                        setFinishValue(value);
                    }}
                />
            </div>
            <div className="">
                <p>{`${t(COMMON_DAYS_LABEL)}: `}</p>
                {setSemesterCheckboxes(checkedDates, setCheckedDates, 'semester_days_markup_')}
            </div>
            <div className="">
                <p>{`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}</p>
                {setSemesterCheckboxes(
                    checkedClasses,
                    setCheckedClasses,
                    'semester_classes_markup_',
                )}
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
                        selected?.length === 0
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
    );
};

const FormSemester = reduxForm({ form: SEMESTER_FORM })(Form);

export default FormSemester;
