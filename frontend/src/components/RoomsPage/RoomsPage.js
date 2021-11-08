import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoomForm from './AddRoomForm/AddRoomForm';
import RoomTypeForm from './RoomTypeForm/RoomTypeForm';
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
    const [idForDialog, setIdForDialog] = useState();
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
        setIdForDialog(id);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };

    const changeGroupDisabledStatus = (currentId) => {
        const foundRoom = [...disabledRooms, ...rooms].find(
            (roomItem) => roomItem.id === currentId,
        );
        return isDisabled ? setEnabledRoomsService(foundRoom) : setDisabledRoomsService(foundRoom);
    };

    const handleConfirm = () => {
        setOpenConfirmDialog(false);
        if (deleteLabel === cardType.TYPE) {
            deleteTypeService(idForDialog);
        }
        if (deleteLabel === cardType.ROOM) {
            if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
                changeGroupDisabledStatus(idForDialog);
            } else {
                deleteRoomCardService(idForDialog);
            }
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
                            <RoomTypeForm
                                className="new-type"
                                setDeleteLabel={setDeleteLabel}
                                onSubmit={addNewTypeService}
                                isOpenConfirmDialog={isOpenConfirmDialog}
                                showConfirmDialog={showConfirmDialog}
                            />
                        </>
                    )}
                </aside>
                <RoomList
                    visibleItems={visibleItems}
                    isDisabled={isDisabled}
                    showConfirmDialog={showConfirmDialog}
                    setDeleteLabel={setDeleteLabel}
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
