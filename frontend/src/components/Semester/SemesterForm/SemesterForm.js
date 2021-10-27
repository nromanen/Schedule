import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import Button from '@material-ui/core/Button';
import { isEmpty } from 'lodash';
import './SemesterForm.scss';
import renderCheckboxField from '../../../share/renderedFields/checkbox';
import renderTextField from '../../../share/renderedFields/input';
import renderMonthPicker from '../../../share/renderedFields/timeSemester';
import { MultiselectForGroups } from '../../../helper/MultiselectForGroups';
import {
    required,
    minYearValue,
    lessThanDate,
    greaterThanDate,
} from '../../../validation/validateFields';
import { getClearOrCancelTitle, setDisableButton } from '../../../helper/disableComponent';
import Card from '../../../share/Card/Card';
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
} from '../../../constants/translationLabels/common';
import { dateFormat } from '../../../constants/formats';
import {
    getToday,
    getTomorrow,
    initialCheckboxesStateForDays,
    createClasslabel,
} from '../../../utils/formUtils';
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';
import { clearSemesterService } from '../../../services/semesterService';

const SemesterForm = (props) => {
    const { t } = useTranslation('formElements');
    const {
        handleSubmit,
        pristine,
        submitting,
        semester,
        classScheduler,
        initialize,
        change,
        selectedGroups,
        setSelectedGroups,
        options,
    } = props;

    const prepSetCheckedClasses = {};

    const [startDate, setStartDate] = useState(getToday());
    const [finishDate, setFinishDate] = useState(getTomorrow());
    const [disabledFinishDate, setDisabledFinishDate] = useState(true);

    const [checkedClasses, setCheckedClasses] = useState(prepSetCheckedClasses);
    const [checkedDates, setCheckedDates] = useState(initialCheckboxesStateForDays);
    const [current, setCurrent] = useState(false);
    const [byDefault, setByDefault] = useState(false);

    const [openGroupDialog, setOpenGroupDialog] = useState(false);

    const clearCheckboxes = () => {
        setCurrent(false);
        setByDefault(false);
        setCheckedDates(initialCheckboxesStateForDays);
    };

    useEffect(() => {
        classScheduler.forEach((classItem) => {
            prepSetCheckedClasses[`${classItem.id}`] = false;
        });
        setCheckedClasses({ ...prepSetCheckedClasses });
        clearCheckboxes();
        const semesterItem = { ...semester };
        clearCheckboxes();
        if (semester.id) {
            const newDays = {};
            const newClasses = {};
            semesterItem.semester_days.forEach((item) => {
                semesterItem[`semester_days_markup_${item}`] = true;
                newDays[item] = true;
            });

            setCheckedDates({
                ...initialCheckboxesStateForDays,
                ...newDays,
            });

            semesterItem.semester_classes.forEach((item) => {
                semesterItem[`semester_classes_markup_${item.id}`] = true;
                newClasses[item.id] = true;
            });

            setCurrent(semester.currentSemester);
            setByDefault(semester.defaultSemester);

            setCheckedClasses({
                ...prepSetCheckedClasses,
                ...newClasses,
            });
        }
        initialize(semesterItem);
    }, [semester, classScheduler]);

    useEffect(() => {
        if (!isEmpty(semester.semester_groups)) {
            setSelectedGroups(getGroupsOptionsForSelect(semester.semester_groups));
        }
    }, [semester.id]);

    const openDialogForGroup = () => {
        setOpenGroupDialog(true);
    };

    const closeDialogForGroup = () => {
        setOpenGroupDialog(false);
    };

    const setStartDayHandler = (startTimeParam) => {
        setStartDate(startTimeParam);
        if (disabledFinishDate || moment(startDate).isSameOrBefore(finishDate)) {
            const newDate = moment(startTimeParam, dateFormat).add(1, 'd');
            setFinishDate(newDate.toDate());
            change('endDay', moment(startTimeParam, dateFormat).add(7, 'd').format(dateFormat));
        }
        setDisabledFinishDate(false);
    };

    const setCheckedHandler = (event, item, checked, setSchecked) => {
        const changedItem = { [item]: event.target.checked };
        setSchecked({
            ...checked,
            ...changedItem,
        });
    };

    const setSemesterCheckboxes = (checked, method, name) => {
        const checkboxes = Object.keys(checked);
        return checkboxes.map((item) => {
            return (
                <Field
                    key={item}
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

    const resetSemesterForm = () => {
        setSelectedGroups([]);
        clearSemesterService();
    };

    return (
        <Card additionClassName="form-card semester-form">
            <h2 style={{ textAlign: 'center' }}>
                {semester.id ? t(COMMON_EDIT) : t(COMMON_CREATE)}
                {` ${t(COMMON_SEMESTER)}`}
            </h2>
            <MultiselectForGroups
                open={openGroupDialog}
                options={options}
                value={selectedGroups}
                onChange={setSelectedGroups}
                onCancel={closeDialogForGroup}
                onClose={closeDialogForGroup}
            />
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
                        minDate={startDate}
                        onChange={(_, value) => {
                            setStartDayHandler(value);
                        }}
                    />
                    <Field
                        className="time-input"
                        name="endDay"
                        component={renderMonthPicker}
                        label={`${t(COMMON_CLASS_TO_LABEL)}:`}
                        validate={[required, greaterThanDate]}
                        minDate={finishDate}
                        disabled={disabledFinishDate}
                        onChange={(_, value) => {
                            setFinishDate(value);
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
                        disabled={(pristine || submitting) && selectedGroups.length === 0}
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
                            selectedGroups.length === 0
                        }
                        onClick={resetSemesterForm}
                    >
                        {getClearOrCancelTitle(semester.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default SemesterForm;
