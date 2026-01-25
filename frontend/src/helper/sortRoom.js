export const sortRooms = (rooms, room, afterId) => {
    let newRooms = rooms;
    if (afterId) {
        const afterRoomIndex = rooms.findIndex(({ id }) => id === afterId);
        newRooms.splice(afterRoomIndex + 1, 0, room);
    } else {
        newRooms = [room, ...rooms];
    }
    return newRooms;
};