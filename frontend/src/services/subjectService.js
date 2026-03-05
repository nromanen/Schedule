import {store} from '../store';

import axios from '../helper/axios';
import { SUBJECT_URL} from '../constants/axios';
import {
    showAllSubjects,
} from '../actions/index';

import {errorHandler} from '../helper/handlerAxios';

export const showAllSubjectsService = () => {
    axios
        .get(SUBJECT_URL)
        .then((response) => {
            store.dispatch(showAllSubjects(response.data));
        })
        .catch((error) => errorHandler(error));
};

