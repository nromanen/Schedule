import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { useTranslation } from 'react-i18next';
import ClassForm from '../../components/ClassForm/ClassForm';
import Card from '../../share/Card/Card';
import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';

import {
    getClassScheduleListService,
    addClassScheduleOneService,
    getClassScheduleOneService,
    deleteClassScheduleOneService,
    clearClassScheduleOneService,
} from '../../services/classService';

import { handleSnackbarOpenService } from '../../services/snackbarService';
import { snackbarTypes } from '../../constants/snackbarTypes';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import {
    CLASS_LABEL,
    CLASS_FROM_LABEL,
    CLASS_TO_LABEL,
    MAX_COUNT_CLASSES_REACHED,
} from '../../constants/translationLabels/formElements';
import {
    COMMON_EDIT_HOVER_TITLE,
    COMMON_DELETE_HOVER_TITLE,
} from '../../constants/translationLabels/common';

const ClassSchedule = (props) => {
    const { t } = useTranslation('formElements');
    const [isOpenDeleteConfirmDialog, setIsOpenDeleteConfirmDialog] = useState(false);
    const [classId, setClassId] = useState(-1);
    useEffect(() => getClassScheduleListService(), []);

    const submit = (values) => {
        if (!values.id && props.classScheduler.length >= 7)
            return handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                t(MAX_COUNT_CLASSES_REACHED),
            );
        return addClassScheduleOneService(values);
    };

    const handleEdit = (id) => {
        getClassScheduleOneService(id);
    };

    const handleClickOpen = (id) => {
        setClassId(id);
        setIsOpenDeleteConfirmDialog(true);
    };

    const handleClose = (id) => {
        setIsOpenDeleteConfirmDialog(false);
        if (!id) return;
        deleteClassScheduleOneService(id);
    };

    return (
        <>
            <NavigationPage name={navigationNames.CLASS_SCHEDULE_TITLE} val={navigation.PERIOD} />
            <div className="cards-container">
                {isOpenDeleteConfirmDialog && (
                    <CustomDialog
                        type={dialogTypes.DELETE_CONFIRM}
                        cardId={classId}
                        whatDelete={cardType.CLASS.toLowerCase()}
                        open={isOpenDeleteConfirmDialog}
                        onClose={handleClose}
                    />
                )}

                <ClassForm onSubmit={submit} onReset={clearClassScheduleOneService} />
                <section className="container-flex-wrap">
                    {props.classScheduler.map((schedule) => (
                        <Card additionClassName="class-card-width" key={schedule.id}>
                            <div className="cards-btns">
                                <FaEdit
                                    className="svg-btn"
                                    title={t(COMMON_EDIT_HOVER_TITLE)}
                                    onClick={() => handleEdit(schedule.id)}
                                />
                                <MdDelete
                                    className="svg-btn"
                                    title={t(COMMON_DELETE_HOVER_TITLE)}
                                    onClick={() => handleClickOpen(schedule.id)}
                                />
                            </div>
                            <p>
                                {t(CLASS_LABEL)}: {schedule.class_name}
                            </p>
                            <p>
                                {t(CLASS_FROM_LABEL)} - {t(CLASS_TO_LABEL)}
                            </p>
                            <p>
                                {schedule.startTime} - {schedule.endTime}
                            </p>
                        </Card>
                    ))}
                </section>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(ClassSchedule);
