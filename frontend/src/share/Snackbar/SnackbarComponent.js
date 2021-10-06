import React from 'react';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { snackbarTypes } from '../../constants/snackbarTypes';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SnackbarComponent = (props) => {
    const message = props.message;
    const type = props.type;
    const isOpen = props.isOpen;
    const handleSnackbarClose = props.handleSnackbarClose;
    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={props.type === snackbarTypes.ERROR ? null : 3000}
            onClose={handleSnackbarClose}
        >
            <Alert onClose={handleSnackbarClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
