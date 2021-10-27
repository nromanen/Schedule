import './RoomList.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import CustomDialog from '../Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoom from '../../components/AddRoomForm/AddRoomForm';
import NewRoomType from '../../components/AddNewRoomType/AddNewRoomType';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { getAllRoomTypesService, addNewTypeService } from '../../services/roomTypesService';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
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
import { ROOM_Y_LABEL, ROOM_LABEL } from '../../constants/translationLabels/formElements';
import {
    TYPE_LABEL,
    COMMON_SET_DISABLED,
    COMMON_SET_ENABLED,
} from '../../constants/translationLabels/common';

const RoomList = (props) => {
    const { rooms, roomTypes, disabledRooms, isOpenConfirmDialog, setOpenConfirmDialog } = props;
    const { t } = useTranslation('formElements');

    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [roomId, setRoomId] = useState(-1);
    const [term, setTerm] = useState('');

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

    const showConfirmDialog = (id, dialogType) => {
        setRoomId(id);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };

    const changeGroupDisabledStatus = (currentId) => {
        const foundRoom = [...disabledRooms, ...rooms].find(
            (roomItem) => roomItem.id === currentId,
        );
        return isDisabled ? setEnabledRoomsService(foundRoom) : setDisabledRoomsService(foundRoom);
    };

    const acceptConfirmDialog = (currentId) => {
        setOpenConfirmDialog(false);
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGroupDisabledStatus(currentId);
        } else {
            deleteRoomCardService(currentId);
        }
    };

    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };

    return (
        <>
            <NavigationPage name={navigationNames.ROOM_LIST} val={navigation.ROOMS} />
            <CustomDialog
                type={confirmDialogType}
                handelConfirm={() => acceptConfirmDialog(roomId)}
                whatDelete={cardType.ROOM.toLowerCase()}
                open={isOpenConfirmDialog}
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
                    {visibleItems.length === 0 && <NotFound name={t(ROOM_Y_LABEL)} />}
                    {visibleItems.map((roomItem) => (
                        <Card key={roomItem.id} additionClassName="room-card done-card">
                            <div className="cards-btns">
                                {!isDisabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_SET_DISABLED)}
                                            onClick={() => {
                                                showConfirmDialog(
                                                    roomItem.id,
                                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                                );
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
                                        title={t(COMMON_SET_ENABLED)}
                                        onClick={() => {
                                            showConfirmDialog(
                                                roomItem.id,
                                                dialogTypes.SET_VISIBILITY_ENABLED,
                                            );
                                        }}
                                    />
                                )}

                                <MdDelete
                                    className="svg-btn"
                                    onClick={() =>
                                        showConfirmDialog(roomItem.id, dialogTypes.DELETE_CONFIRM)
                                    }
                                />
                            </div>

                            <span> {`${t(ROOM_LABEL)}:`} </span>
                            <h2 className="room-card__number">{roomItem.name}</h2>
                            <span>{`${t(TYPE_LABEL)}:`}</span>
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
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomList);
