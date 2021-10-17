import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import FreeRoomForm from '../../components/FreeRoomForm/freeRoomForm';
import { clearFreeRoomsService, showFreeRoomsService } from '../../services/freeRoomsService';
import { getClassScheduleListService } from '../../services/classService';
import { CustomDialog } from '../../share/DialogWindows';

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

    const submit = (values) => {
        showFreeRoomsService(values);
    };

    return (
        <>
            <span className="navLinks" onClick={handleClickOpen} aria-hidden="true">
                {t('find_free_room')}
            </span>

            <CustomDialog
                title=""
                open={open}
                onClose={handleClose}
                buttons={
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        color="primary"
                        title={t('close_title')}
                    >
                        {t('common:close_title')}
                    </Button>
                }
                maxWidth="lg"
                aria-labelledby="form-dialog-title"
            >
                <div className="cards-container ">
                    <aside className="free-rooms__panel">
                        <div className="freeRoomForms">
                            <h2 id="form-dialog-title">{t('find_free_room')}</h2>
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
            </CustomDialog>
        </>
    );
};

const mapStateToProps = (state) => ({
    freeRooms: state.freeRooms.freeRooms,
});

export default connect(mapStateToProps)(FreeRooms);
