import { useMutation } from '@tanstack/react-query';
import { useHistory } from 'react-router-dom';
import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import { LOGIN_LINK } from '../constants/links';
import { setPassword } from '../api/setPasswordApi';

export const useSetPassword = () => {
    const history = useHistory();

    return useMutation({
        mutationFn: setPassword,
        onSuccess: () => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                'Password has been set successfully!',
            );
            history.push(LOGIN_LINK);
        },
        onError: (error) => {
            handleSnackbarOpenService(
                true,
                snackbarTypes.ERROR,
                createErrorMessage(error),
            );
        },
    });
};