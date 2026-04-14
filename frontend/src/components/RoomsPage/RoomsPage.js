import React, { useState } from 'react';
import { get } from 'lodash';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import AddRoomForm from './RoomForm/RoomForm';
import RoomTypeForm from './RoomTypeForm/RoomTypeForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import RoomList from './RoomsList/RoomsList';
import {
    useEnabledRooms,
    useDisabledRooms,
    useAllRoomTypes,
    useSaveRoom,
    useDeleteRoom,
    useToggleRoomVisibility,
    useReorderRoom,
    useSaveRoomType,
    useDeleteRoomType,
} from '../../hooks/useRooms';

const RoomPage = () => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [deleteLabel, setDeleteLabel] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [oneRoom, setOneRoom] = useState(null);
    const [oneType, setOneType] = useState(null);
    const [term, setTerm] = useState('');

    // ─── Queries ───────────────────────────────────────────────────────────
    const { data: rooms = [], isLoading } = useEnabledRooms();
    const { data: disabledRooms = [] } = useDisabledRooms();
    const { data: roomTypes = [] } = useAllRoomTypes();

    // ─── Mutations ─────────────────────────────────────────────────────────
    const saveRoom = useSaveRoom();
    const deleteRoom = useDeleteRoom();
    const toggleVisibility = useToggleRoomVisibility();
    const reorderRoom = useReorderRoom();
    const saveRoomType = useSaveRoomType();
    const deleteRoomType = useDeleteRoomType();

    // ─── Handlers ──────────────────────────────────────────────────────────
    const submitRoomForm = (values) => {
        const type = roomTypes.find((rt) => rt.id === values.type);
        const afterId = values.afterId ? values.afterId.id : null;
        saveRoom.mutate(
            { ...values, type, afterId },
            { onSuccess: () => setOneRoom(null) },
        );
    };

    const submitRoomTypeForm = (values) => {
        saveRoomType.mutate(values, { onSuccess: () => setOneType(null) });
    };

    const showConfirmDialog = (id, dialogType, label) => {
        setSelectedId(id);
        setConfirmDialogType(dialogType);
        setDeleteLabel(label);
        setIsOpenConfirmDialog(true);
    };

    const handleConfirm = () => {
        setIsOpenConfirmDialog(false);

        if (deleteLabel === cardType.TYPE) {
            deleteRoomType.mutate(selectedId);
            return;
        }

        if (deleteLabel === cardType.ROOM) {
            if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
                const allRooms = [...rooms, ...disabledRooms];
                const room = allRooms.find((r) => r.id === selectedId);
                if (room) toggleVisibility.mutate(room);
            } else {
                deleteRoom.mutate(selectedId);
            }
        }
    };

    const loading = isLoading || saveRoom.isPending || reorderRoom.isPending;

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
                    <SearchPanel
                        SearchChange={setTerm}
                        showDisabled={() => setIsDisabled((prev) => !prev)}
                    />
                    {!isDisabled && (
                        <>
                            <AddRoomForm
                                onSubmit={submitRoomForm}
                                clearRoomItem={() => setOneRoom(null)}
                                oneRoom={oneRoom}
                                roomTypes={roomTypes}
                                rooms={rooms}
                            />
                            <RoomTypeForm
                                onSubmit={submitRoomTypeForm}
                                isOpenConfirmDialog={isOpenConfirmDialog}
                                showConfirmDialog={showConfirmDialog}
                                oneType={oneType}
                                roomTypes={roomTypes}
                                setSelectRoomType={setOneType}
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
                        setSelectRoom={setOneRoom}
                        loading={loading}
                        dragAndDropRoom={(dragRoom, afterRoomId) =>
                            reorderRoom.mutate({ dragRoom, afterRoomId })
                        }
                    />
                )}
            </div>
        </>
    );
};

export default RoomPage;