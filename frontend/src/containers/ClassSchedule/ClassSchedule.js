import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { useTranslation } from 'react-i18next';
import ClassForm from '../../components/ClassForm/ClassForm';
import Card from '../../share/Card/Card';
import ConfirmDialog from '../../share/modals/dialog';
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
    COMMON_EDIT_HOVER_TITLE,
    COMMON_DELETE_HOVER_TITLE,
    MAX_COUNT_CLASSES_REACHED,
} from '../../constants/translationLabels';

const ClassSchedule = (props) => {
    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [classId, setClassId] = React.useState(-1);
    useEffect(() => getClassScheduleListService(), []);

    const submit = (values) => {
        if (!values.id && props.classScheduler.length >= 7)
            return handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                t(MAX_COUNT_CLASSES_REACHED),
            );
        addClassScheduleOneService(values);
    };

    const handleEdit = (classId) => {
        getClassScheduleOneService(classId);
    };

    const handleFormReset = () => {
        clearClassScheduleOneService();
    };

    const handleClickOpen = (classId) => {
        setClassId(classId);
        setOpen(true);
    };

    const handleClose = (classId) => {
        setOpen(false);
        if (!classId) {
            return;
        }
        deleteClassScheduleOneService(classId);
    };

    return (
        <>
            <NavigationPage name={navigationNames.CLASS_SCHEDULE_TITLE} val={navigation.PERIOD} />
            <div className="cards-container">
                <ConfirmDialog
                    selectedValue=""
                    cardId={classId}
                    whatDelete={cardType.CLASS.toLowerCase()}
                    open={open}
                    onClose={handleClose}
                />
                <ClassForm onSubmit={submit} onReset={handleFormReset} />
                <section className="container-flex-wrap">
                    {props.classScheduler.map((schedule) => (
                        <Card class="class-card-width" key={schedule.id}>
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
