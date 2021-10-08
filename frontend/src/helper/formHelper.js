import { reset } from 'redux-form';
import { store } from '../redux';

export const resetFormHandler = (formName) => {
    store.dispatch(reset(formName));
};
