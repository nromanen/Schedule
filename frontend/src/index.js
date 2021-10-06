import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { Provider } from 'react-redux';
import rootReducer from './redux/reducers/index';
import rootSaga from './sagas';

import './index.scss';

import App from './App';

import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
    (process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null) ||
    compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);

serviceWorker.unregister();
