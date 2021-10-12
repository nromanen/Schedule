import './RoomList.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { ConfirmDialog } from '../../share/modals/dialog';
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
    const { rooms, roomTypes, disabledRooms } = props;
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [roomCard, setRoomCard] = useState({ id: null, disabledStatus: null });
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

    useEffect(() => {
        showListOfRoomsService();
        getAllRoomTypesService();
        getDisabledRoomsService();
    }, []);

    const SearchChange = setTerm;
    const visibleItems = isDisabled
        ? search(disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);

    const createRoom = (values) => {
        const description = roomTypes.find((type) => type.id === +values.type);
        const typeDescription = description.description;
        createRoomService({ ...values, typeDescription });
    };

    const showConfirmDialog = (id, disabledStatus) => {
        setRoomCard({ id, disabledStatus });
        setIsOpenConfirmDialog(true);
    };

    const changeGroupDisabledStatus = (roomId) => {
        const foundRoom = [...disabledRooms, ...rooms].find((roomItem) => roomItem.id === roomId);
        return isDisabled ? setEnabledRoomsService(foundRoom) : setDisabledRoomsService(foundRoom);
    };

    const acceptConfirmDialog = (roomId) => {
        setIsOpenConfirmDialog(false);
        if (!roomId) return;
        if (roomCard.disabledStatus) {
            changeGroupDisabledStatus(roomId);
        } else {
            deleteRoomCardService(roomId);
        }
        setRoomCard((prev) => ({ ...prev, disabledStatus: null }));
    };

    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };

    return (
        <>
            <NavigationPage name={navigationNames.ROOM_LIST} val={navigation.ROOMS} />
            <ConfirmDialog
                cardId={roomCard.id}
                whatDelete={cardType.ROOM.toLowerCase()}
                open={isOpenConfirmDialog}
                isHide={roomCard.disabledStatus}
                onClose={acceptConfirmDialog}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {!isDisabled && (
                        <>
                            <AddRoom onSubmit={createRoom} onReset={clearRoomOneService} />
                            <NewRoomType className="new-type" onSubmit={addNewTypeService} />
                        </>
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && <NotFound name={t('room_y_label')} />}
                    {visibleItems.map((roomItem) => (
                        <Card key={roomItem.id} class="room-card done-card">
                            <div className="cards-btns">
                                {!isDisabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                showConfirmDialog(roomItem.id, disabledCard.HIDE);
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn"
                                            onClick={() => selectOneRoomService(roomItem.id)}
                                        />
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            showConfirmDialog(roomItem.id, disabledCard.SHOW);
                                        }}
                                    />
                                )}

                                <MdDelete
                                    className="svg-btn"
                                    onClick={() => showConfirmDialog(roomItem.id)}
                                />
                            </div>

                            <span> {`${t('room_label')}:`} </span>
                            <h2 className="room-card__number">{roomItem.name}</h2>
                            <span>{`${t('type_label')}:`}</span>
                            <h2 className="room-card__number">{roomItem.type.description}</h2>
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
