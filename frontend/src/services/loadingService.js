import { store } from '../index';

import { setLoading, setScheduleLoading } from '../redux/actions/index';

export const setLoadingService = isLoading => {
    store.dispatch(setLoading(isLoading));
};

export const setScheduleLoadingService = isLoading => {
    store.dispatch(setScheduleLoading(isLoading));
};
