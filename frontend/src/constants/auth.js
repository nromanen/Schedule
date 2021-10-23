import {
    SUCCESSFUL_LOGIN_MESSAGE,
    SUCCESSFUL_REGISTERED_MESSAGE,
    SUCCESSFUL_RESET_PASSWORD_MESSAGE,
} from './translationLabels/common';

export const GOOGLE_AUTH_CLIENT_ID =
    '733778708110-dmif84arh6rk3h3kq3cng1h8dqciodlf.apps.googleusercontent.com';

export const authTypes = {
    LOGIN: 'LOGIN',
    GOOGLE: 'GOOGLE',
    REGISTRATION: 'REGISTRATION',
    RESET_PASSWORD: 'RESET_PASSWORD',
};
export const successAuthMessages = {
    [authTypes.LOGIN]: SUCCESSFUL_LOGIN_MESSAGE,
    [authTypes.GOOGLE]: SUCCESSFUL_LOGIN_MESSAGE,
    [authTypes.REGISTRATION]: SUCCESSFUL_REGISTERED_MESSAGE,
    [authTypes.RESET_PASSWORD]: SUCCESSFUL_RESET_PASSWORD_MESSAGE,
};
