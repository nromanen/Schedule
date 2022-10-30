import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

import {useTranslation} from 'react-i18next';
import ClassForm from '../../components/ClassForm/ClassForm';
import Card from '../../share/Card/Card';
import CustomDialog from '../Dialogs/CustomDialog';
import {dialogTypes} from '../../constants/dialogs';
import {cardType} from '../../constants/cardType';

import {
    classFormHandler,
    clearClassScheduleSuccess,
    deleteClassScheduleStart,
    getClassScheduleByIdStart,
    getClassScheduleListStart,
} from '../../actions/classes';
import {setIsOpenConfirmDialog} from '../../actions/dialog';

import {handleSnackbarOpenService} from '../../services/snackbarService';
import {snackbarTypes} from '../../constants/snackbarTypes';
import {
    CLASS_FROM_LABEL,
    CLASS_LABEL,
    CLASS_TO_LABEL,
    MAX_COUNT_CLASSES_REACHED,
} from '../../constants/translationLabels/formElements';
import * as moment from "moment";
import {timeFormat} from "../../constants/formats";
import DeleteButton from "../../components/Buttons/DeleteButton";
import EditButton from "../../components/Buttons/EditButton";
import './ClassSchedule.scss'
const ClassSchedule = (props) => {
    const {t} = useTranslation('formElements');
    const {
        isOpenConfirmDialog,
        setOpenConfirmDialog,
        formHandler,
        getClassScheduleList,
        deleteClassSchedule,
        getClassScheduleById,
        clearClassSchedule,
    } = props;
    const [classId, setClassId] = useState(-1);
    useEffect(() => {
        getClassScheduleList();
    }, []);

    const submit = (values) => {
        const res = {
            ...values,
            startTime: moment(values.startTime, timeFormat).format(timeFormat),
            endTime: moment(values.endTime, timeFormat).format(timeFormat)
        }
        if (!res.id && props.classScheduler.length >= 7)
            return handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                t(MAX_COUNT_CLASSES_REACHED),
            );
        return formHandler(res);
    };

    const handleEdit = (id) => {
        getClassScheduleById(id);
    };

    const handleClickOpen = (id) => {
        setClassId(id);
        setOpenConfirmDialog(true);
    };

    const handleDelete = (id) => {
        setOpenConfirmDialog(false);
        deleteClassSchedule(id);
    };

    return (
        <div className="cards-container class-schedule">
            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                handelConfirm={() => handleDelete(classId)}
                whatDelete={cardType.CLASS.toLowerCase()}
                open={isOpenConfirmDialog}
            />

            <ClassForm onSubmit={submit} onReset={clearClassSchedule}/>
            <section className="container-flex-wrap">
                {props.classScheduler.map((schedule) => (
                    <Card additionClassName="class-card-width" key={schedule.id}>
                        <div className="cards-btns">
                            <EditButton
                                onClick={_ => handleEdit(schedule.id)}
                            />
                            <DeleteButton
                                onClick={_ => handleClickOpen(schedule.id)}
                            />
                        </div>
                        <span>
                        <p className={'class-schedule-card-description-name'}>
                            <span>{t(CLASS_LABEL)}:</span>
                            <span>{schedule.class_name}</span>

                        </p>
                        <p className={'class-schedule-card-description-value'}>
                            <span>{t(CLASS_FROM_LABEL)}</span>
                            <span>-</span>
                            <span>{t(CLASS_TO_LABEL)}</span>
                        </p>
                        <p className={'class-schedule-card-description-value'}>
                             <span>{schedule.startTime}</span>
                            <span>-</span>
                            <span>{schedule.endTime}</span>
                        </p>
                        </span>

                    </Card>
                ))}
            </section>
        </div>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    formHandler: (values) => dispatch(classFormHandler(values)),
    getClassScheduleList: () => dispatch(getClassScheduleListStart()),
    deleteClassSchedule: (id) => dispatch(deleteClassScheduleStart(id)),
    getClassScheduleById: (id) => dispatch(getClassScheduleByIdStart(id)),
    clearClassSchedule: () => dispatch(clearClassScheduleSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClassSchedule);
