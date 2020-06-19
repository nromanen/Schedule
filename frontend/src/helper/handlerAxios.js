import { handleSnackbarOpenService } from '../services/snackbarService';
import { snackbarTypes } from '../constants/snackbarTypes';
import i18n from './i18n';

export const errorHandler = error => {
    handleSnackbarOpenService(true, snackbarTypes.ERROR, 'Error');
};

export const successHandler = message => {
    handleSnackbarOpenService(true, snackbarTypes.SUCCESS, message);
};
