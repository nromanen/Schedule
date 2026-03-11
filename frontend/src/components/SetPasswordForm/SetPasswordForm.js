import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import { RHFTextField } from '../../share/rhf';
import { useSetPassword } from '../../hooks/useSetPassword';

import './SetPasswordForm.scss';

const SetPasswordForm = () => {
    const { t: tForm } = useTranslation('formElements');
    const { t: tVal } = useTranslation('validationMessages');
    const { mutate: submitSetPassword, isLoading } = useSetPassword();

    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const {
        control,
        handleSubmit,
        watch,
        formState: { isDirty, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = watch('password');

    const onFormSubmit = ({ password }) => {
        submitSetPassword({ token, password });
    };

    if (!token) {
        return (
            <div className="auth-container">
                <Card additionClassName="form-card">
                    <p className="set-password-error">
                        {tForm('invalid_token_message')}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <Card additionClassName="form-card">
                <h2 className="form-title">{tForm('set_password_title')}</h2>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <RHFTextField
                        control={control}
                        name="password"
                        label={tForm('new_password_label')}
                        type="password"
                        className="form-field"
                        rules={{
                            required: tVal('required_message'),
                            minLength: {
                                value: 8,
                                message: tVal('bigger_than_char_message', { min: 8 }),
                            },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                                message: tVal('password'),
                            },
                        }}
                    />

                    <RHFTextField
                        control={control}
                        name="confirmPassword"
                        label={tForm('confirm_password_label')}
                        type="password"
                        className="form-field"
                        rules={{
                            required: tVal('required_message'),
                            validate: (value) =>
                                value === password || tVal('passwords_mismatch_message'),
                        }}
                    />

                    <div className="form-buttons-container">
                        <Button
                            className="buttons-style"
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isDirty || isSubmitting || isLoading}
                        >
                            {tForm('set_password_button')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SetPasswordForm;