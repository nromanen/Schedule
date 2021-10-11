import React from 'react';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { snackbarTypes } from '../../constants/snackbarTypes';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SnackbarComponent = (props) => {
    const { message, type, isOpen, handleSnackbarClose } = props;
    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={type === snackbarTypes.ERROR ? null : 3000}
            onClose={handleSnackbarClose}
        >
            <Alert onClose={handleSnackbarClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
