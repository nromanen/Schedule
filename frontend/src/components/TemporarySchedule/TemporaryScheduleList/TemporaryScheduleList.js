import React, { useState } from 'react';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';

import Divider from '@material-ui/core/Divider';
import shortId from 'shortid';
import Card from '../../../share/Card/Card';
import ConfirmDialog from '../../../share/modals/dialog';

import {
    deleteTemporaryScheduleService,
    selectTemporaryScheduleService,
    selectVacationService,
} from '../../../services/temporaryScheduleService';

import { cardType } from '../../../constants/cardType';
import TemporaryScheduleCard from '../TemporaryScheduleCard/TemporaryScheduleCard';
import { getTeacherForSite } from '../../../helper/renderTeacher';
import {
    EDIT_HOVER_TITLE,
    DELETE_HOVER_TITLE,
    HOLIDAY_LABEL,
    DATE_LABEL,
    FOR_ALL,
} from '../../../constants/translationLabels/common.js';

const TemporaryScheduleList = (props) => {
    const { t } = useTranslation('common');

    const temporarySchedules = props.temporarySchedules || [];

    const [open, setOpen] = useState(false);
    const [temporaryScheduleId, setTemporaryScheduleId] = useState(-1);

    const handleClickOpen = (id) => {
        setTemporaryScheduleId(id);
        setOpen(true);
    };

    const handleClose = (id) => {
        setOpen(false);
        if (!id) {
            return;
        }
        deleteTemporaryScheduleService(id, null, null);
    };

    return (
        <main className="container-flex-wrap">
            <ConfirmDialog
                cardId={temporaryScheduleId}
                whatDelete={cardType.TEMPORARY_SCHEDULE}
                open={open}
                onClose={handleClose}
            />
            {temporarySchedules.map((temporarySchedule) => (
                <Card
                    class={`done-card${temporarySchedule.vacation ? ' vacation-card' : ''}`}
                    key={shortId.generate()}
                >
                    <div className="cards-btns">
                        <FaEdit
                            title={t(EDIT_HOVER_TITLE)}
                            className="svg-btn edit-btn"
                            onClick={() =>
                                temporarySchedule.vacation
                                    ? selectVacationService(temporarySchedule)
                                    : selectTemporaryScheduleService(temporarySchedule)
                            }
                        />
                        <MdDelete
                            title={t(DELETE_HOVER_TITLE)}
                            className="svg-btn delete-btn"
                            onClick={() => {
                                handleClickOpen(temporarySchedule.id);
                            }}
                        />
                    </div>
                    {!temporarySchedule.vacation ? (
                        <>
                            <TemporaryScheduleCard schedule={temporarySchedule} />
                        </>
                    ) : (
                        <>
                            <h2>{t(HOLIDAY_LABEL)}</h2>
                            <p>
                                (
                                {temporarySchedule.teacher?.name
                                    ? getTeacherForSite(temporarySchedule.teacher)
                                    : t(FOR_ALL)}
                                )
                            </p>
                            <Divider />
                        </>
                    )}
                    <p>
                        {!temporarySchedule.vacation && <>{t(DATE_LABEL)} :</>}
                        <b>{temporarySchedule.date}</b>
                    </p>
                </Card>
            ))}
        </main>
    );
};

export default TemporaryScheduleList;
