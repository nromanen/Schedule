import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoomForm from './AddRoomForm/AddRoomForm';
import NewRoomType from './AddNewRoomType/AddNewRoomType';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import { search } from '../../helper/search';
import { handleRoomFormSubmitStart } from '../../actions/rooms';
import {
    getAllRoomTypesService,
    addNewTypeService,
    deleteTypeService,
} from '../../services/roomTypesService';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import {
    createRoomService,
    showListOfRoomsService,
    deleteRoomCardService,
    clearRoomOneService,
    getDisabledRoomsService,
    setDisabledRoomsService,
    setEnabledRoomsService,
} from '../../services/roomService';
import RoomList from './RoomsList/RoomsList';

const RoomPage = (props) => {
    const {
        rooms,
        roomTypes,
        disabledRooms,
        isOpenConfirmDialog,
        setOpenConfirmDialog,
        oneRoom,
        handleRoomFormSubmit,
    } = props;

    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [deleteLabel, setDeleteLabel] = useState('');
    const [typeId, setTypeId] = useState('');
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

    const submitRoomForm = (values) => {
        const type = roomTypes.find((roomType) => roomType.id === values.type);
        handleRoomFormSubmit({ ...values, type });
    };

    const showConfirmDialog = (id, dialogType) => {
        setRoomId(id);
        setDeleteLabel(cardType.ROOM.toLowerCase());
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
    const handleConfirm = () => {
        if (deleteLabel === cardType.TYPE.toLowerCase()) {
            setOpenConfirmDialog(false);
            deleteTypeService(typeId);
        }
        if (deleteLabel === cardType.ROOM.toLowerCase()) {
            acceptConfirmDialog(roomId);
        }
    };
    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };

    return (
        <>
            <CustomDialog
                type={confirmDialogType}
                handelConfirm={handleConfirm}
                whatDelete={deleteLabel}
                open={isOpenConfirmDialog}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {!isDisabled && (
                        <>
                            <AddRoomForm
                                onSubmit={submitRoomForm}
                                onReset={clearRoomOneService}
                                oneRoom={oneRoom}
                                roomTypes={roomTypes}
                            />
                            <NewRoomType
                                className="new-type"
                                setTypeId={setTypeId}
                                setDeleteLabel={setDeleteLabel}
                                setConfirmDialogType={setConfirmDialogType}
                                onSubmit={addNewTypeService}
                            />
                        </>
                    )}
                </aside>
                <RoomList
                    visibleItems={visibleItems}
                    isDisabled={isDisabled}
                    showConfirmDialog={showConfirmDialog}
                />
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
    handleRoomFormSubmit: (values) => dispatch(handleRoomFormSubmitStart(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);
