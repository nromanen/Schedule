import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import ClassForm from '../../components/ClassForm/ClassForm';
import Card from '../../share/Card/Card';
import CustomDialog from '../Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { handleSnackbarOpenService } from '../../services/snackbarService';
import { snackbarTypes } from '../../constants/snackbarTypes';
import {
    CLASS_FROM_LABEL,
    CLASS_LABEL,
    CLASS_TO_LABEL,
    MAX_COUNT_CLASSES_REACHED,
} from '../../constants/translationLabels/formElements';
import { COMMON_DELETE_HOVER_TITLE, COMMON_EDIT_HOVER_TITLE } from '../../constants/translationLabels/common';
import { useClasses, useCreateClass, useDeleteClass, useUpdateClass } from '../../hooks/useClassSchedule';
import './ClassSchedule.scss';

const ClassSchedule = () => {
    const { t } = useTranslation('formElements');
    const [classId, setClassId] = useState(-1);
    const [selectedClass, setSelectedClass] = useState({});
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

    const { data: classes = [] } = useClasses();
    const updateClass = useUpdateClass();
    const createClass = useCreateClass();
    const deleteClass = useDeleteClass();

    const submit = (values) => {
        if (!values.id && classes.length >= 7) {
            return handleSnackbarOpenService(true, snackbarTypes.ERROR, t(MAX_COUNT_CLASSES_REACHED));
        }
        if (values.id) {
            updateClass.mutate(values, {
                onSuccess: () => setSelectedClass({}),
            });
        } else {
            createClass.mutate(values);
        }
    };

    const handleEdit = (id) => {
        const found = classes.find((item) => item.id === id);
        setSelectedClass(found || {});
    };

    const handleClickOpen = (id) => {
        setClassId(id);
        setIsOpenConfirmDialog(true);
    };

    const handleDelete = () => {
        setIsOpenConfirmDialog(false);
        deleteClass.mutate(classId);
    };

    const handleClear = () => {
        setSelectedClass({});
    };

    return (
        <div className="cards-container">
            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                handelConfirm={handleDelete}
                whatDelete={cardType.CLASS.toLowerCase()}
                open={isOpenConfirmDialog}
            />

            <ClassForm
                onSubmit={submit}
                onReset={handleClear}
                classSchedule={selectedClass}
            />

            <section className="container-flex-wrap">
                {classes.map((schedule) => (
                    <Card additionClassName="class-card" key={schedule.id}>
                        <h2 className="class-card__name">{schedule.class_name}</h2>
                        <p className="class-card__label">{t(CLASS_FROM_LABEL)} — {t(CLASS_TO_LABEL)}</p>
                        <p className="class-card__time">{schedule.startTime} — {schedule.endTime}</p>
                        <div className="cards-btns">
                            <FaEdit
                                className="svg-btn edit-btn"
                                title={t(COMMON_EDIT_HOVER_TITLE)}
                                onClick={() => handleEdit(schedule.id)}
                            />
                            <MdDelete
                                className="svg-btn delete-btn"
                                title={t(COMMON_DELETE_HOVER_TITLE)}
                                onClick={() => handleClickOpen(schedule.id)}
                            />
                        </div>
                    </Card>
                ))}
            </section>
        </div>
    );
};

export default ClassSchedule;