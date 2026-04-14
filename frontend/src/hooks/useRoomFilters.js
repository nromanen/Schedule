import { useState, useEffect, useMemo } from 'react';

export const useRoomFilters = (mergedBusyRooms) => {
    const [activeRoomTypes, setActiveRoomTypes] = useState([]);
    const [selectedRoomIds, setSelectedRoomIds] = useState(null);

    const roomTypes = useMemo(() =>
            [...new Set(mergedBusyRooms.map(r => r.room_type).filter(Boolean))],
        [mergedBusyRooms]
    );

    useEffect(() => {
        if (roomTypes.length) {
            setActiveRoomTypes(roomTypes);
        }
    }, [roomTypes.join(',')]);

    const roomOptions = useMemo(() =>
            mergedBusyRooms
                .filter(r => activeRoomTypes.includes(r.room_type))
                .map(r => ({ value: r.room_id, label: r.room_name })),
        [mergedBusyRooms, activeRoomTypes]
    );

    const selectedOptions = selectedRoomIds
        ? roomOptions.filter(o => selectedRoomIds.includes(o.value))
        : [];

    const filteredRooms = useMemo(() =>
            mergedBusyRooms.filter(room => {
                const typeMatch = activeRoomTypes.includes(room.room_type);
                const roomMatch = selectedRoomIds === null || selectedRoomIds.includes(room.room_id);
                return typeMatch && roomMatch;
            }),
        [mergedBusyRooms, activeRoomTypes, selectedRoomIds]
    );

    const handleRoomTypeToggle = (type) => {
        setActiveRoomTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
        setSelectedRoomIds(null);
    };

    const handleRoomSelect = (selected) => {
        setSelectedRoomIds(selected?.length ? selected.map(s => s.value) : null);
    };

    return {
        roomTypes,
        roomOptions,
        selectedOptions,
        filteredRooms,
        activeRoomTypes,
        selectedRoomIds,
        handleRoomTypeToggle,
        handleRoomSelect,
    };
};