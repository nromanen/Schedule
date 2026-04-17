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

import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.render(
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </Provider>
        </QueryClientProvider>
    </ErrorBoundary>,
    document.getElementById('root'),
);

serviceWorker.unregister();
