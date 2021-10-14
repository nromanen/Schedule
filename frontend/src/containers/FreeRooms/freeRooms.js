import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import FreeRoomForm from '../../components/FreeRoomForm/freeRoomForm';
import { clearFreeRoomsService, showFreeRoomsService } from '../../services/freeRoomsService';
import { getClassScheduleListService } from '../../services/classService';

import './freeRooms.scss';

const FreeRooms = (props) => {
    const { t } = useTranslation('formElements');

    const [open, setOpen] = useState(false);

    const { classScheduler } = props;

    useEffect(() => getClassScheduleListService(), []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFormReset = () => {
        clearFreeRoomsService();
    };

    const submit = (values) => {
        showFreeRoomsService(values);
    };

    return (
        <>
            <span className="navLinks" onClick={handleClickOpen} aria-hidden="true">
                {t('find_free_room')}
            </span>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                aria-labelledby="form-dialog-title"
            >
                <div className="cards-container ">
                    <aside className="free-rooms__panel">
                        <Card additionClassName="free-rooms-wrapper freeRoomCard">
                            <div className="freeRoomForms">
                                <h2 id="form-dialog-title">{t('find_free_room')}</h2>
                                <FreeRoomForm
                                    classScheduler={classScheduler}
                                    onReset={handleFormReset}
                                    onSubmit={submit}
                                />
                            </div>
                        </Card>
                    </aside>
                    <section className="container-flex-wrap wrapper">
                        {props.freeRooms.map((freeRoom) => (
                            <Card key={freeRoom.id} className="container">
                                <div className="freeRoomCard">
                                    <span> {`${t('room_label')}:`} </span>
                                    <h2 className="room-card__number">{freeRoom.name}</h2>
                                    <span>{`${t('type_label')}:`}</span>
                                    <h2 className="room-card__number">
                                        {freeRoom.type.description}
                                    </h2>
                                </div>
                            </Card>
                        ))}
                    </section>
                </div>
            </Dialog>
        </>
    );
};

const mapStateToProps = (state) => ({
    freeRooms: state.freeRooms.freeRooms,
});

export default connect(mapStateToProps)(FreeRooms);
