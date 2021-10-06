import React, { Suspense, useEffect } from 'react';
import './App.scss';
import Routers from './router/Routers';
import './helper/i18n';
import { connect } from 'react-redux';

import { authCheckState } from './redux/actions/index';
import { handleSnackbarCloseService } from './services/snackbarService';
import SnackbarComponent from './share/Snackbar/SnackbarComponent';
import SuccessSnackbar from './components/SuccessSnackbar/SuccessSnackbar';

const App = (props) => {
    const { isSnackbarOpen, snackbarType, snackbarMessage } = props;
    const handleSnackbarClose = (event, reason) => {
        if (!reason === 'clickaway') {
            return;
        }

        handleSnackbarCloseService();
    };

    useEffect(() => {
        props.onTryAutoLogin();
    }, []);

    return (
        <Suspense fallback={null}>
            <div className="container">
                <Routers />
                <SuccessSnackbar />
                <SnackbarComponent
                    message={snackbarMessage}
                    type={snackbarType}
                    isOpen={isSnackbarOpen}
                    handleSnackbarClose={handleSnackbarClose}
                />
            </div>
        </Suspense>
    );
};

const mapStateToProps = (state) => ({
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
});

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoLogin: () => dispatch(authCheckState()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
