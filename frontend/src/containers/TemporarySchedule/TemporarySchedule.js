import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TemporaryScheduleForm
    from '../../components/Changes/TemporaryScheduleForm/TemporaryScheduleForm';
import TemporaryScheduleList
    from '../../components/Changes/TemporaryScheduleList/TemporaryScheduleList';

import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { styled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {
    getTemporarySchedulesService,
    selectTeacherIdService
} from '../../services/temporaryScheduleService';
import { showAllTeachersService } from '../../services/teacherService';
import { setLoadingService } from '../../services/loadingService';

import Card from '../../share/Card/Card';

import './TemporarySchedule.scss';

const TeacherField = styled(TextField)({
    display: 'inline-block',
    width: '250px'
});

const TemporarySchedule = props => {
    const { t } = useTranslation('common');
    const isLoading = props.loading;

    const { teachers, teacherId } = props;


    useEffect(() => {
        setLoadingService(true);
        showAllTeachersService();
    }, []);

    useEffect(() => {
        if (teacherId) {
            setLoadingService(true);
            getTemporarySchedulesService(teacherId);
        }
    }, [teacherId]);

    const defaultProps = {
        options: teachers,
        getOptionLabel: option =>
            option
                ? option.surname +
                  ' ' +
                  option.name +
                  ' ' +
                  option.patronymic +
                  `(${option.position})`
                : ''
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
        <>
            <Card class="card-title lesson-card">
                <div className="page-title">
                    <h1 className="page-h">
                        {t('temporary_schedule_for_teacher_title')}
                    </h1>
                    <Autocomplete
                        {...defaultProps}
                        clearOnEscape
                        openOnFocus
                        value={handleFindTeacher(teacherId)}
                        onChange={(event, newValue) => {
                            handleTeacherSelect(newValue);
                        }}
                        renderInput={params => (
                            <TeacherField
                                {...params}
                                label={t('formElements:teacher_label')}
                                margin="normal"
                            />
                        )}
                    />
                </div>
            </Card>
            <div className="cards-container">
                <TemporaryScheduleForm
                    temporarySchedule={props.temporarySchedule}
                />
                {isLoading ? (
                    <section className="centered-container">
                        <CircularProgress />
                    </section>
                ) : (
                    <TemporaryScheduleList changes={props.temporarySchedules} />
                )}
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    temporarySchedules: state.temporarySchedule.temporarySchedules,
    temporarySchedule: state.temporarySchedule.temporarySchedule,
    loading: state.loadingIndicator.loading,
    teachers: state.teachers.teachers,
    teacherId: state.temporarySchedule.teacherId
});

export default connect(mapStateToProps)(TemporarySchedule);
