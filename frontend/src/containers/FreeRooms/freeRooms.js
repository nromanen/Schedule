import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import FreeRoomForm from '../../components/FreeRoomForm/freeRoomForm';
import { clearFreeRoomsService, showFreeRoomsService } from '../../services/freeRoomsService';
import { getClassScheduleListService } from '../../services/classService';
import CustomDialog from '../Dialogs/CustomDialog';
import { dialogCloseButton } from '../../constants/dialogs';

import './freeRooms.scss';
import { ROOM_LABEL, FIND_FREE_ROOM } from '../../constants/translationLabels/formElements';
import { TYPE_LABEL } from '../../constants/translationLabels/common';

const FreeRooms = (props) => {
    const { t } = useTranslation('formElements');

    const [isOpenFreeRoomDialog, setIsOpenFreeRoomDialog] = useState(false);

    const { classScheduler } = props;

    useEffect(() => getClassScheduleListService(), []);

    const handleClickOpen = () => {
        setIsOpenFreeRoomDialog(true);
    };

    const handleClose = () => {
        setIsOpenFreeRoomDialog(false);
    };

    const submit = (values) => {
        showFreeRoomsService(values);
    };

    return (
        <>
            <span className="navLinks" onClick={handleClickOpen} aria-hidden="true">
                {t(FIND_FREE_ROOM)}
            </span>
            {isOpenFreeRoomDialog && (
                <CustomDialog
                    title={t(FIND_FREE_ROOM)}
                    open={isOpenFreeRoomDialog}
                    onClose={handleClose}
                    buttons={[dialogCloseButton(handleClose)]}
                    maxWidth="lg"
                    aria-labelledby="form-dialog-title"
                >
                    <div className="cards-container ">
                        <aside className="free-rooms__panel">
                            <div className="freeRoomForms">
                                <FreeRoomForm
                                    classScheduler={classScheduler}
                                    onReset={clearFreeRoomsService}
                                    onSubmit={submit}
                                />
                            </div>
                        </aside>
                        <section className="container-flex-wrap wrapper">
                            {props.freeRooms.map((freeRoom) => (
                                <Card key={freeRoom.id} className="container">
                                    <div className="freeRoomCard">
                                        <span> {`${t(ROOM_LABEL)}:`} </span>
                                        <h2 className="room-card__number">{freeRoom.name}</h2>
                                        <span>{`${t(TYPE_LABEL)}:`}</span>
                                        <h2 className="room-card__number">
                                            {freeRoom.type.description}
                                        </h2>
                                    </div>
                                </Card>
                            ))}
                        </section>
                    </div>
                </CustomDialog>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    freeRooms: state.freeRooms.freeRooms,
});

export default connect(mapStateToProps)(FreeRooms);
