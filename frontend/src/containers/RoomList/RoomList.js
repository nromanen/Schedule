import './RoomList.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import ConfirmDialog from '../../share/modals/dialog';
import { cardType } from '../../constants/cardType';
import AddRoom from '../../components/AddRoomForm/AddRoomForm';
import NewRoomType from '../../components/AddNewRoomType/AddNewRoomType';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { getAllRoomTypesService, addNewTypeService } from '../../services/roomTypesService';
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

const RoomList = (props) => {
    const { t } = useTranslation('formElements');
    const [hideDialog, setHideDialog] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [roomId, setRoomId] = useState(-1);
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState('');
    const { rooms, roomTypes, disabledRooms } = props;
    useEffect(() => {
        showListOfRoomsService();
        getAllRoomTypesService();
        getDisabledRoomsService();
    }, []);

    const createRoom = (values) => {
        const description = roomTypes.find((type) => type.id === +values.type);
        const typeDescription = description.description;
        createRoomService({ ...values, typeDescription });
    };

    const editHandler = (id) => {
        selectOneRoomService(id);
    };

    const handleFormReset = () => {
        clearRoomOneService();
    };

    const handleClickOpen = (id) => {
        setRoomId(id);
        setOpen(true);
    };

    const disabledRoomsCard = () => {
        const allRooms = [...disabledRooms, ...rooms];
        const room = allRooms.find((roomItem) => roomItem.id === roomId);
        return disabled ? setEnabledRoomsService(room) : setDisabledRoomsService(room);
    };

    const handleClose = (id) => {
        setOpen(false);
        if (!id) return;
        if (hideDialog) {
            disabledRoomsCard();
        } else {
            deleteRoomCardService(roomId);
        }
        setHideDialog(null);
    };

    const submitType = (values) => {
        addNewTypeService(values);
    };

    const visibleItems = disabled
        ? search(disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);

    const SearchChange = () => {
        setTerm(term);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    return (
        <>
            <NavigationPage name={navigationNames.ROOM_LIST} val={navigation.ROOMS} />
            <ConfirmDialog
                cardId={roomId}
                whatDelete={cardType.ROOM.toLowerCase()}
                open={open}
                isHide={hideDialog}
                onClose={handleClose}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    {!disabled && (
                        <>
                            <AddRoom onSubmit={createRoom} onReset={handleFormReset} />
                            <NewRoomType className="new-type" onSubmit={submitType} />
                        </>
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && <NotFound name={t('room_y_label')} />}
                    {visibleItems.map((room) => (
                        <Card key={room.id} {...room} class="room-card done-card">
                            <div className="cards-btns">
                                {!disabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                setHideDialog(disabledCard.HIDE);
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
                                            setHideDialog(disabledCard.SHOW);
                                            handleClickOpen(room.id);
                                        }}
                                    />
                                )}

                                <MdDelete
                                    className="svg-btn"
                                    onClick={() => handleClickOpen(room.id)}
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
