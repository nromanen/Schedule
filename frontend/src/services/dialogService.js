import { setIsOpenConfirmDialog } from '../actions/dialog';
import { store } from '../store';

export const setIsOpenConfirmDialogService = (newState) => {
    store.dispatch(setIsOpenConfirmDialog(newState));
};
