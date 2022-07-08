export const sortRooms = (rooms, room, afterId) => {
    let newRooms = rooms;
    if (afterId) {
        const afterRoomsIndex = rooms.findIndex(({ id }) => id === afterId);
        newRooms.splice(afterRoomsIndex + 1, 0, room);
    } else {
        newRooms = [room, ...rooms];
    }
    return newRooms;
};