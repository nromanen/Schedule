import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import { snackbarTypes } from '../../constants/snackbarTypes';
import { Alert } from '../Alerts';

const SnackbarComponent = (props) => {
    const { message, type, isOpen, handleSnackbarClose } = props;
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={isOpen}
            autoHideDuration={type === snackbarTypes.ERROR ? null : 3000}
            onClose={handleSnackbarClose}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 200 }}
        >
            <Alert onClose={handleSnackbarClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;