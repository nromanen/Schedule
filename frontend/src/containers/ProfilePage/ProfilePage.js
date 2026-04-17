import './ProfilePage.scss';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import { getUserProfile, updateUserPassword } from '../../services/userService';
import {
    DEPARTMENT_TEACHER_LABEL,
    EMAIL_LABEL,
    TEACHER_FIRST_NAME,
    TEACHER_PATRONYMIC,
    TEACHER_POSITION,
    TEACHER_SURNAME,
} from '../../constants/translationLabels/formElements';
import { COMMON_MY_PROFILE } from '../../constants/translationLabels/common';

const ProfilePage = (props) => {
    const { t } = useTranslation('formElements');
    const { teacher } = props;

    const submitPasswordChange = (values) => {
        updateUserPassword(values);
    };

    useEffect(() => {
        getUserProfile();
    }, [localStorage.getItem('userRole')]);

    const renderTeacherData = () => {
        if (localStorage.getItem('userRole') === 'ROLE_TEACHER' && teacher && teacher.id) {
            return (
                <div className="teacher-info">
                    <div className="info-row">
                        <span className="info-label">{t(TEACHER_SURNAME)}</span>
                        <span className="info-value">{teacher.surname}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">{t(TEACHER_FIRST_NAME)}</span>
                        <span className="info-value">{teacher.name}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">{t(TEACHER_PATRONYMIC)}</span>
                        <span className="info-value">{teacher.patronymic}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">{t(TEACHER_POSITION)}</span>
                        <span className="info-value">{teacher.position}</span>
                    </div>
                    {teacher.department && (
                        <div className="info-row">
                            <span className="info-label">{t(DEPARTMENT_TEACHER_LABEL)}</span>
                            <span className="info-value">{teacher.department.name}</span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="profile-container">
            <Card additionClassName="form-card">
                <h2 className="form-title">{t(COMMON_MY_PROFILE)}</h2>
                <section>
                    <span>{`${t(EMAIL_LABEL)}: `}</span>
                    <span>{localStorage.getItem('email')}</span>
                </section>
                {renderTeacherData()}
                <ChangePasswordForm onSubmit={submitPasswordChange} />
            </Card>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.users.user,
    teacher: state.teachers.teacher,
});

export default connect(mapStateToProps)(ProfilePage);