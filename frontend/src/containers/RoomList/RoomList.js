import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import FreeRooms from '../FreeRooms/freeRooms';
import AddRoom from '../../components/AddRoomForm/AddRoomForm';
import NewRoomType from '../../components/AddNewRoomType/AddNewRoomType';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Card from '../../share/Card/Card';
import './RoomList.scss';
import { search } from '../../helper/search';

import {
    createRoomService,
    showListOfRoomsService,
    deleteRoomCardService,
    selectOneRoomService,
    clearRoomOneService,
    getDisabledRoomsService,
    setDisabledRoomsService,
    setEnabledRoomsService,
} from '../../services/roomService';

import { getAllRoomTypesService, addNewTypeService } from '../../services/roomTypesService';

import NotFound from '../../share/NotFound/NotFound';

import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';

const RoomList = (props) => {
    const { rooms } = props;

    useEffect(() => {
        showListOfRoomsService();
    }, []);

    useEffect(() => {
        getAllRoomTypesService();
    }, []);

    useEffect(() => {
        getDisabledRoomsService();
    }, []);

    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [roomId, setRoomId] = useState(-1);
    const [term, setTerm] = useState('');
    const [hideDialog, setHideDialog] = useState(null);

    const [disabled, setDisabled] = useState(false);

    const createRoom = (values) => {
        const description = props.roomTypes.find((type) => type.id == values.type);
        values.typeDescription = description.description;
        createRoomService(values);
    };

    const editHandler = (roomId) => {
        selectOneRoomService(roomId);
    };

    const handleFormReset = () => {
        clearRoomOneService();
    };

    const handleClickOpen = (roomId) => {
        setRoomId(roomId);
        setOpen(true);
    };

    const handleClose = (roomId) => {
        setOpen(false);
        if (!roomId) {
            return;
        }
        switch (subDialogType) {
            case dialogTypes.DELETE_CONFIRM:
                deleteRoomCardService(roomId);
                break;
            case dialogTypes.SET_VISIBILITY_DISABLED:
                {
                    const room = props.rooms.find((roomItem) => roomItem.id === roomId);
                    setDisabledRoomsService(room);
                }

                break;
            case dialogTypes.SET_VISIBILITY_ENABLED:
                {
                    const room = props.disabledRooms.find((roomItem) => roomItem.id === roomId);
                    setEnabledRoomsService(room);
                }
                break;
            default:
                break;
        }
        setHideDialog(null);
    };

    const submitType = (values) => {
        addNewTypeService(values);
    };

    const visibleItems = disabled
        ? search(props.disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);

    const SearchChange = (term) => {
        setTerm(term);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    return (
        <>
            <NavigationPage name={navigationNames.ROOM_LIST} val={navigation.ROOMS} />
            <CustomDialog
                type={subDialogType}
                cardId={roomId}
                whatDelete={cardType.ROOM.toLowerCase()}
                open={open}
                onClose={handleClose}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    {disabled ? (
                        ''
                    ) : (
                        <>
                            <AddRoom onSubmit={createRoom} onReset={handleFormReset} />
                            <NewRoomType className="new-type" onSubmit={submitType} />
                        </>
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && <NotFound name={t('room_y_label')} />}
                    {visibleItems.map((room, index) => (
                        <Card key={index} {...room} class="room-card done-card">
                            <div className="cards-btns">
                                {!disabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                setSubDialogType(
                                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                                );
                                                handleClickOpen(room.id);
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn"
                                            onClick={() => editHandler(room.id)}
                                        />
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setSubDialogType(dialogTypes.SET_VISIBILITY_ENABLED);
                                            handleClickOpen(room.id);
                                        }}
                                    />
                                )}

                                <MdDelete
                                    className="svg-btn"
                                    onClick={() => {
                                        setSubDialogType(dialogTypes.DELETE_CONFIRM);
                                        handleClickOpen(room.id);
                                    }}
                                />
                            </div>

                            <span> {`${t('room_label')}:`} </span>
                            <h2 className="room-card__number">{room.name}</h2>
                            <span>{`${t('type_label')}:`}</span>
                            <h2 className="room-card__number">{room.type.description}</h2>
                        </Card>
                    ))}
                </section>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    rooms: state.rooms.rooms,
    disabledRooms: state.rooms.disabledRooms,
    oneRoom: state.rooms.oneRoom,
    roomTypes: state.roomTypes.roomTypes,
    oneType: state.roomTypes.oneType,
});

export default connect(mapStateToProps, {})(RoomList);
