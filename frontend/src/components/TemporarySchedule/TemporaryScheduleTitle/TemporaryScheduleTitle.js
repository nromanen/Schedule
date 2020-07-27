import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import MomentUtils from '@date-io/moment';
import * as moment from 'moment';

import { temporaryScheduleRadioTypes } from '../../../constants/temporaryScheduleRadioTypes';

import {
    getTeacherTemporarySchedulesService,
    getTemporarySchedulesService,
    selectTeacherIdService
} from '../../../services/temporaryScheduleService';
import { handleTeacherInfo } from '../../../helper/handleTeacherInfo';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
    teacherField: {
        width: '250px'
    },
    dateGroup: {
        display: 'flex',
        margin: '0 auto',
        width: '250px',
        justifyContent: 'space-between'
    },
    dateField: {
        width: '120px',
        margin: '0'
    },
    day: {
        width: '250px',
        margin: '0'
    },
    button: {
        width: '250px',
        margin: '0 auto'
    },
    panel: {
        width: '300px',
        margin: '0 auto'
    },
    block: {
        display: 'block'
    },
    legendBlock: {
        textAlign: 'left',
        margin: '10px 0'
    },
    legend: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        backgroundColor: '#F5DEB3'
    }
});

const TemporaryScheduleTitle = props => {
    const { t } = useTranslation('common');
    const classes = useStyles();
    const [day, setDay] = useState(null);

    const [radio, setRadio] = useState(temporaryScheduleRadioTypes.SEMESTER);

    const { teachers, teacherId } = props;
    const { toDate, setToDate } = props;
    const { fromDate, setFromDate } = props;

    useEffect(() => {
        if (radio === temporaryScheduleRadioTypes.SEMESTER)
            getTemporarySchedulesService(null, null);
    }, []);

    const handleChange = event => {
        if (event.target.value === temporaryScheduleRadioTypes.SEMESTER)
            selectTeacherIdService(null);
        setToDate(false);
        setFromDate(false);
        setDay(false);
        setRadio(event.target.value);
    };

    const handleDayChange = date => {
        setFromDate(null);
        setToDate(null);
        setDay(moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY'));
    };

    const handleFromDateChange = date => {
        setDay(null);
        setFromDate(moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY'));
    };

    const handleToDateChange = date => {
        setDay(null);
        setToDate(moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY'));
    };

    const handleClick = () => {
        let fDate;
        let tDate;
        switch (radio) {
            case temporaryScheduleRadioTypes.SEMESTER:
                fDate = null;
                tDate = null;
                break;
            case temporaryScheduleRadioTypes.FEW_DAYS:
                fDate = fromDate;
                tDate = toDate;
                break;
            case temporaryScheduleRadioTypes.ONE_DAY:
                fDate = day;
                tDate = day;
                break;
            default:
                tDate = null;
                fDate = null;
        }
        if (teacherId) {
            getTeacherTemporarySchedulesService(teacherId, fDate, tDate);
        } else {
            getTemporarySchedulesService(fDate, tDate);
        }
    };

    const defaultProps = {
        options: teachers,
        getOptionLabel: option => (option ? handleTeacherInfo(option) : '')
    };

    const handleFindTeacher = teacherId => {
        if (teacherId)
            return teachers.find(teacher => teacher.id === teacherId);
        else return '';
    };

    const handleTeacherSelect = teacher => {
        if (teacher) selectTeacherIdService(teacher.id);
    };

    return (
        <section className={classes.panel}>
            <ExpansionPanel>
                <ExpansionPanelSummary aria-controls="panel1a-content">
                    <Typography className={classes.heading}>
                        {t('temporary_schedule_for_teacher_title')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.block}>
                    <Divider />
                    <div className={classes.legendBlock}>
                        <div className={classes.legend} /> -{' '}
                        {t('holiday_label')}
                    </div>
                    <Divider />
                    <RadioGroup
                        className={classes.dateGroup}
                        value={radio}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value={temporaryScheduleRadioTypes.SEMESTER}
                            control={<Radio color="primary" />}
                            label={t('formElements:semester_label')}
                        />
                        <FormControlLabel
                            value={temporaryScheduleRadioTypes.FEW_DAYS}
                            control={<Radio color="primary" />}
                            label={t('few_days_label')}
                        />
                        <FormControlLabel
                            value={temporaryScheduleRadioTypes.ONE_DAY}
                            control={<Radio color="primary" />}
                            label={t('one_day')}
                        />
                    </RadioGroup>
                    {radio !== temporaryScheduleRadioTypes.SEMESTER && (
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            {radio === temporaryScheduleRadioTypes.FEW_DAYS ? (
                                <div className={classes.dateGroup}>
                                    <DatePicker
                                        margin="normal"
                                        label={t(
                                            'formElements:class_from_label'
                                        )}
                                        format="DD/MM/YYYY"
                                        className={classes.dateField}
                                        value={
                                            fromDate
                                                ? moment(
                                                      fromDate,
                                                      'DD/MM/YYYY'
                                                  ).toDate()
                                                : null
                                        }
                                        onChange={handleFromDateChange}
                                    />
                                    <DatePicker
                                        margin="normal"
                                        className={classes.dateField}
                                        label={t('formElements:class_to_label')}
                                        format="DD/MM/YYYY"
                                        value={
                                            toDate
                                                ? moment(
                                                      toDate,
                                                      'DD/MM/YYYY'
                                                  ).toDate()
                                                : null
                                        }
                                        onChange={handleToDateChange}
                                    />
                                </div>
                            ) : (
                                <DatePicker
                                    margin="normal"
                                    className={classes.day}
                                    label={t('date')}
                                    format="DD/MM/YYYY"
                                    value={
                                        day
                                            ? moment(day, 'DD/MM/YYYY').toDate()
                                            : null
                                    }
                                    onChange={handleDayChange}
                                />
                            )}
                        </MuiPickersUtilsProvider>
                    )}
                    {radio !== temporaryScheduleRadioTypes.SEMESTER && (
                        <Autocomplete
                            {...defaultProps}
                            clearOnEscape
                            openOnFocus
                            value={handleFindTeacher(teacherId)}
                            onChange={(event, newValue) => {
                                if (!newValue) handleTeacherSelect({});
                                else handleTeacherSelect(newValue);
                            }}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    className={classes.teacherField}
                                    label={t('formElements:teacher_label')}
                                    margin="normal"
                                />
                            )}
                        />
                    )}

                    <Button
                        variant="contained"
                        className={classes.button}
                        color="primary"
                        onClick={handleClick}
                        disabled={
                            (((!toDate || !fromDate) && !day) || !teacherId) &&
                            !temporaryScheduleRadioTypes.SEMESTER
                        }
                    >
                        Search
                    </Button>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </section>
    );
};

export default TemporaryScheduleTitle;
