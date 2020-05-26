import { store } from '../index';

import { BUSY_ROOMS } from '../constants/axios';
import axios from '../helper/axios';

import { showAllBusyRooms } from '../redux/actions';
import { errorHandler } from '../helper/handlerAxios';

export const showBusyRooms = semesterId => {
    axios
        .get(BUSY_ROOMS + '?semesterId=' + semesterId)
        .then(response => {
            store.dispatch(showAllBusyRooms(response.data));
        })
        .catch(error => {
            errorHandler(error);
        });
};
