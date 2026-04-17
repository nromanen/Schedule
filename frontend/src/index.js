import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {I18nextProvider} from 'react-i18next';
import {QueryClientProvider} from '@tanstack/react-query';
import {queryClient} from './queryClient';

import App from './App';
import {store} from './store';
import * as serviceWorker from './serviceWorker';
import i18n from './i18n';
import './index.scss';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/uk';

import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: { variant: 'standard' },
        },
        MuiSelect: {
            defaultProps: { variant: 'standard' },
        },
        MuiFormControl: {
            defaultProps: { variant: 'standard' },
        },
    },
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <CssBaseline />
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <I18nextProvider i18n={i18n}>
                            <App />
                        </I18nextProvider>
                    </Provider>
                </QueryClientProvider>
            </ErrorBoundary>
        </LocalizationProvider>
    </ThemeProvider>,
    document.getElementById('root'),
);

serviceWorker.unregister();
