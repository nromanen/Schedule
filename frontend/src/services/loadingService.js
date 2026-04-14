import {store} from '../store';

import {setLoading, setSemesterLoading} from '../actions/index';

export const setLoadingService = (isLoading) => {
    store.dispatch(setLoading(isLoading));
};

export const setSemesterLoadingService = (isLoading) => {
    store.dispatch(setSemesterLoading(isLoading));
};
