import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoomForm from './RoomForm/RoomForm';
import RoomTypeForm from './RoomTypeForm/RoomTypeForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import RoomList from './RoomsList/RoomsList';

const RoomPage = (props) => {
    const {
        rooms,
        roomTypes,
        oneType,
        disabledRooms,
        isOpenConfirmDialog,
        setOpenConfirmDialog,
        oneRoom,
        handleRoomFormSubmit,
        getListOfRooms,
        getListOfDisabledRooms,
        getAllRoomTypes,
        toggleRoomVisibility,
        deleteRoom,
        deleteRoomType,
        handleRoomTypeFormSubmit,
        setSelectRoom,
        clearRoomItem,
        setSelectRoomType,
        loading,
        dragAndDropRoom,
    } = props;

    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [deleteLabel, setDeleteLabel] = useState('');
    const [selectedId, setSelectedId] = useState();
    const [term, setTerm] = useState('');

    useEffect(() => {
        getAllRoomTypes();
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
        const afterId = values.afterId ? values.afterId.id : null;
        handleRoomFormSubmit({ ...values, type, afterId });
    };

    const showConfirmDialog = (id, dialogType, label) => {
        setSelectedId(id);
        setDeleteLabel(label);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };

    const handleConfirm = () => {
        setOpenConfirmDialog(false);
        if (deleteLabel === cardType.TYPE) deleteRoomType(selectedId);
        if (deleteLabel === cardType.ROOM) {
            if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
                toggleRoomVisibility(selectedId, isDisabled);
            } else {
                deleteRoom(selectedId, isDisabled);
            }
        }
    };
    const changeDisable = () => setIsDisabled((prev) => !prev);

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
                                clearRoomItem={clearRoomItem}
                                oneRoom={oneRoom}
                                roomTypes={roomTypes}
                                rooms={rooms}
                            />
                            <RoomTypeForm
                                onSubmit={handleRoomTypeFormSubmit}
                                isOpenConfirmDialog={isOpenConfirmDialog}
                                showConfirmDialog={showConfirmDialog}
                                oneType={oneType}
                                roomTypes={roomTypes}
                                setSelectRoomType={setSelectRoomType}
                            />
                        </>
                    )}
                </aside>
                {!get(rooms[0], 'schedules') && (
                    <RoomList
                        isDisabled={isDisabled}
                        showConfirmDialog={showConfirmDialog}
                        term={term}
                        disabledRooms={disabledRooms}
                        rooms={rooms}
                        setSelectRoom={setSelectRoom}
                        loading={loading}
                        dragAndDropRoom={dragAndDropRoom}
                    />
                )}
            </div>
        </>
    );
};

export default RoomPage;