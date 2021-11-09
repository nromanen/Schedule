import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import FreeRoomForm from './freeRoomForm';
import { getClassScheduleListService } from '../../services/classService';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogCloseButton } from '../../constants/dialogs';
import './FreeRoomsDialog.scss';
import { ROOM_LABEL, FIND_FREE_ROOM } from '../../constants/translationLabels/formElements';
import { TYPE_LABEL } from '../../constants/translationLabels/common';

const FreeRoomsDialog = (props) => {
    const { getFreeRoomsByParams } = props;
    const { t } = useTranslation('formElements');
    const [isOpenFreeRoomDialog, setIsOpenFreeRoomDialog] = useState(false);

    useEffect(() => {
        getClassScheduleListService();
    }, []);

    const handleIsOpenFreeRoomDialog = () => {
        setIsOpenFreeRoomDialog((prev) => !prev);
    };
    const submit = (values) => {
        console.log(values);
        // getFreeRoomsByParams(values);
    };

    return (
        <>
            <span className="navLinks" onClick={handleIsOpenFreeRoomDialog} aria-hidden="true">
                {t(FIND_FREE_ROOM)}
            </span>
            {isOpenFreeRoomDialog && (
                <CustomDialog
                    title={t(FIND_FREE_ROOM)}
                    open={isOpenFreeRoomDialog}
                    onClose={handleIsOpenFreeRoomDialog}
                    buttons={[dialogCloseButton(handleIsOpenFreeRoomDialog)]}
                    maxWidth="lg"
                    aria-labelledby="form-dialog-title"
                >
                    <div className="cards-container ">
                        <aside className="free-rooms__panel">
                            <div className="freeRoomForms">
                                <FreeRoomForm onSubmit={submit} />
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

export default FreeRoomsDialog;
