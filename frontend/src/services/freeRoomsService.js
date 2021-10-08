import axios from '../helper/axios';
import { store } from '../redux';

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
            const bufferArray = [];
            const results = response.data;
            for (const key in results) {
                bufferArray.push({
                    id: key,
                    ...results[key],
                });
            }
            store.dispatch(showFreeRooms(bufferArray));
        })
        .catch((error) => {
            errorHandler(error);
        });
};

export const clearFreeRoomsService = () => {
    store.dispatch(clearFreeRooms());
    resetFormHandler(FREE_ROOMS);
};
