import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoomForm from './AddRoomForm/AddRoomForm';
import RoomTypeForm from './RoomTypeForm/RoomTypeForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import {
    handleRoomFormSubmitStart,
    getListOfRoomsStart,
    getListOfDisabledRoomsStart,
} from '../../actions/rooms';
import {
    getAllRoomTypesService,
    addNewTypeService,
    deleteTypeService,
} from '../../services/roomTypesService';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import {
    deleteRoomCardService,
    clearRoomOneService,
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
        getListOfRooms,
        getListOfDisabledRooms,
    } = props;

    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [deleteLabel, setDeleteLabel] = useState('');
    const [selectedId, setSelectedId] = useState();
    const [term, setTerm] = useState('');

    useEffect(() => {
        getAllRoomTypesService();
    }, []);

    useEffect(() => {
        if (isDisabled) {
            getListOfDisabledRooms();
        } else {
            getListOfRooms();
        }
    }, [isDisabled]);

    const submitRoomForm = (values) => {
        const type = roomTypes.find((roomType) => roomType.id === values.type);
        handleRoomFormSubmit({ ...values, type });
    };

    const showConfirmDialog = (id, dialogType) => {
        setSelectedId(id);
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
            deleteTypeService(selectedId);
        }
        if (deleteLabel === cardType.ROOM) {
            if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
                changeGroupDisabledStatus(selectedId);
            } else {
                deleteRoomCardService(selectedId);
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
                    <SearchPanel SearchChange={setTerm} showDisabled={changeDisable} />
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
                    isDisabled={isDisabled}
                    showConfirmDialog={showConfirmDialog}
                    setDeleteLabel={setDeleteLabel}
                    term={term}
                    disabledRooms={disabledRooms}
                    rooms={rooms}
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
    getListOfRooms: (rooms) => dispatch(getListOfRoomsStart(rooms)),
    getListOfDisabledRooms: (rooms) => dispatch(getListOfDisabledRoomsStart(rooms)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);
