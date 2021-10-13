const validation = {
    EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[!@#$%^&*]).{8,}$/,
};
const UNIQUE_ERROR_MESSAGE = 'validationMessages:unique_error_message';

export { validation, UNIQUE_ERROR_MESSAGE };
