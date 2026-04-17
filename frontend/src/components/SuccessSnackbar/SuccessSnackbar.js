import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Fade from '@mui/material/Fade';
import { Icon } from '@mui/material';
import React from 'react';
import { clearSnackbar } from '../../actions/snackBarReducer';

export default function SuccessSnackbar() {
    const dispatch = useDispatch();

    const { successSnackbarMessage, successSnackbarOpen } = useSelector((state) => state);

    function handleClose() {
        dispatch(clearSnackbar());
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={successSnackbarOpen}
            autoHideDuration={4000}
            onClose={handleClose}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 200 }}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar">
                    <Icon>check_circle</Icon>
                    {successSnackbarMessage}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                    size="large"
                >
                    <Icon>close</Icon>
                </IconButton>,
            ]}
        />
    );
}