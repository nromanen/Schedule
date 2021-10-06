import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { setLoadingService } from '../../services/loadingService';
import { getTeachersWithoutAccount } from '../../services/teacherService';
import { getUsersService, mergeUserAndTeacherService } from '../../services/userService';

import Card from '../../share/Card/Card';

import './MergeRolePage.scss';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';

const useStyles = makeStyles(() => ({
    autoCompleteField: {
        '&': {
            display: 'inline-block',
            margin: '0 10px 10px 0',
            width: 200,
        },
    },
}));

const MergeRolePage = (props) => {
    const { t } = useTranslation('common');

    const [teacher, setTeacher] = useState(null);
    const [user, setUser] = useState(null);

    const classes = useStyles();

    const { teachers } = props;
    const { users } = props;

    useEffect(() => getTeachersWithoutAccount(), []);
    useEffect(() => getUsersService(), []);

    const defaultPropsTeachers = {
        options: teachers,
        getOptionLabel: (option) =>
            option
                ? `${option.position} ${option.surname} ${option.name} ${option.patronymic}`
                : '',
    };

    const defaultPropsUsers = {
        options: users,
        getOptionLabel: (option) => (option ? option.email : ''),
    };

    const mergeUserAndTeacherHandle = () => {
        if (!user || !teacher) return;
        mergeUserAndTeacherService({ teacherId: teacher.id, userId: user.id });
        setUser(null);
        setTeacher(null);
        setLoadingService(true);
    };

    return (
        <>
            <NavigationPage val={navigation.USERS} />
            <div className="merge-role-form">
                <Card class="merge-role-card">
                    <h2 className="under-line">{t('merge_header')}</h2>
                    {props.loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <div className="autocomplete-group">
                                <Autocomplete
                                    {...defaultPropsTeachers}
                                    clearOnEscape
                                    openOnFocus
                                    className={classes.autoCompleteField}
                                    onChange={(event, newValue) => {
                                        setTeacher(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('formElements:teacher_label')}
                                            margin="normal"
                                        />
                                    )}
                                />
                                <Autocomplete
                                    {...defaultPropsUsers}
                                    clearOnEscape
                                    openOnFocus
                                    className={classes.autoCompleteField}
                                    onChange={(event, newValue) => {
                                        setUser(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('formElements:user_label')}
                                            margin="normal"
                                        />
                                    )}
                                />
                            </div>
                            <Button
                                className="merge-btn"
                                variant="contained"
                                color="primary"
                                onClick={() => mergeUserAndTeacherHandle()}
                            >
                                {t('formElements:merge_button')}
                            </Button>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    teachers: state.teachers.teachers,
    users: state.users.users,
    loading: state.loadingIndicator.loading,
});

export default connect(mapStateToProps)(MergeRolePage);
