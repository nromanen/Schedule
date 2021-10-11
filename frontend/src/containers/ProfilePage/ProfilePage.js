import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import Card from '../../share/Card/Card';

import './ProfilePage.scss';

import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';

import { makeStyles } from '@material-ui/core/styles';

import { resetFormHandler } from '../../helper/formHelper';
import { useTranslation } from 'react-i18next';
import { PROFILE_FORM, TEACHER_FORM } from '../../constants/reduxForms';

import { getUserProfile, updateUserPassword, updateUserTeacher } from '../../services/userService';
import AddTeacherForm from '../../components/AddTeacherForm/AddTeacherForm';
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import {
    EMAIL_LABEL,
    COMMON_MY_PROFILE,
    DIFFERENT_PASSWORDS,
} from '../../constants/translationLabels';

const useStyles = makeStyles((theme) => ({
    rootInput: {
        width: '20em',
    },
}));

const ProfilePage = (props) => {
    const { t } = useTranslation('formElements');
    const classes = useStyles();

    const submitPasswordChange = (values) => {
        console.log('values', values);
        if (values.new_password !== values.confirm_password) {
            props.setError({
                registration: { passwords: t(DIFFERENT_PASSWORDS) },
            });
            return;
        }
        updateUserPassword(values);
        handlePasswordFormReset();
    };

    const submitTeacherChange = (values) => {
        updateUserTeacher(values);
    };
    const handlePasswordFormReset = () => resetFormHandler(PROFILE_FORM);
    const handleTeacherFormReset = () => resetFormHandler(TEACHER_FORM);
    useEffect(() => {
        getUserProfile();
    }, [localStorage.getItem('userRole')]);

    const renderTeacherdataForm = () => {
        if (localStorage.getItem('userRole') === 'ROLE_TEACHER') {
            return (
                <AddTeacherForm onSubmit={submitTeacherChange} onReset={handleTeacherFormReset} />
            );
        }
    };

    return (
        <>
            <NavigationPage />
            <Card class="form-card">
                <h2 className="form-title">{t(COMMON_MY_PROFILE)}</h2>
                <section>
                    <span>{`${t(EMAIL_LABEL)}: `}</span>
                    <span>{localStorage.getItem('email')}</span>
                </section>
                <ChangePasswordForm
                    onSubmit={submitPasswordChange}
                    onReset={handlePasswordFormReset}
                />
            </Card>
            {renderTeacherdataForm()}
        </>
    );
};

const mapStateToProps = (state) => ({
    user: state.users.user,
});

export default connect(mapStateToProps)(ProfilePage);
