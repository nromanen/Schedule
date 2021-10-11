import axios from '../helper/axios';
import { store } from '../index';
import { showFreeRooms, clearFreeRooms } from '../redux/actions/freeRooms';
import { FREE_ROOMS_URL } from '../constants/axios';
import { FREE_ROOMS } from '../constants/reduxForms';
import { errorHandler } from '../helper/handlerAxios';
import { resetFormHandler } from '../helper/formHelper';

export const showFreeRoomsService = (elem) => {
    axios
        .get(
            `${FREE_ROOMS_URL}?dayOfWeek=${elem.dayOfWeek}&evenOdd=${elem.evenOdd}&classId=${elem.class}&semesterId=${elem.semesterId}`,
        )
        .then((response) => {
            const results = response.data;
            store.dispatch(showFreeRooms(results));
        })
        .catch((error) => {
            errorHandler(error);
        });
};

export const clearFreeRoomsService = () => {
    store.dispatch(clearFreeRooms());
    resetFormHandler(FREE_ROOMS);
};
