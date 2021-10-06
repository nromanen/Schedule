import { reset } from 'redux-form';
import { store } from '../index';

export const resetFormHandler = (formName) => {
    store.dispatch(reset(formName));
};
