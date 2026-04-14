import axios from '../helper/axios';
import { COMBINED_BUSY_ROOMS_URL, DISABLED_ROOMS_URL,
    ROOM_ORDERED_URL,
    ROOM_TYPES_URL,
    ROOM_URL,
    ROOM_AFTER_URL,
} from '../constants/axios';

// ─── Rooms ───────────────────────────────────────────────────────────────────

export const fetchEnabledRooms = () =>
    axios.get(ROOM_ORDERED_URL).then((res) => res.data);

export const fetchDisabledRooms = () =>
    axios.get(DISABLED_ROOMS_URL).then((res) => res.data);

export const saveRoom = ({ afterId, ...room }) =>
    axios[room.id ? 'put' : 'post'](
        `${ROOM_AFTER_URL}/${afterId ?? 0}`,
        room,
    ).then((res) => res.data);

export const deleteRoom = (roomId) =>
    axios.delete(`${ROOM_URL}/${roomId}`).then((res) => res.data);

export const toggleRoom = (room) =>
    axios.put(ROOM_URL, { ...room, disable: !room.disable }).then((res) => res.data);

export const reorderRoom = ({ dragRoom, afterRoomId }) =>
    axios.put(`${ROOM_AFTER_URL}/${afterRoomId ?? 0}`, dragRoom).then((res) => res.data);

// ─── Room Types ───────────────────────────────────────────────────────────────

export const fetchAllRoomTypes = () =>
    axios.get(ROOM_TYPES_URL).then((res) => res.data);

export const saveRoomType = (roomType) =>
    axios[roomType.id ? 'put' : 'post'](ROOM_TYPES_URL, roomType).then((res) => res.data);

export const deleteRoomType = (roomTypeId) =>
    axios.delete(`${ROOM_TYPES_URL}/${roomTypeId}`).then((res) => res.data);

export const fetchCombinedBusyRooms = () =>
    axios.get(COMBINED_BUSY_ROOMS_URL).then(res => res.data);