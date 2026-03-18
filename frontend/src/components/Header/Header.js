import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {isNil} from 'lodash';
import {Link} from 'react-router-dom';
import {
    FaCaretDown,
    FaClipboardList,
    FaClock,
    FaEye,
    FaEyeSlash, FaFileExcel,
    FaHome,
    FaRunning,
    FaSignOutAlt,
    FaTrash,
    FaUser,
} from 'react-icons/fa';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import {useTranslation} from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Header.scss';
import {
    ADMIN_PAGE_LINK,
    HOME_PAGE_LINK,
    LOGIN_LINK,
    LOGOUT_LINK,
    MY_LESSONS_LINK,
    MY_PROFILE_LINK,
    SCHEDULE_PAGE_LINK,
    SCHEDULE_FOR_LINK,
} from '../../constants/links';

import LanguageSelector from '../LanguageSelector/LanguageSelector';
import * as colors from '../../constants/schedule/colors';

import FreeRooms from '../../containers/Dialogs/FreeRoomsDialog';
import {setSemesterLoadingService} from '../../services/loadingService';
import {
    ADMIN_TITLE,
    CLEAR_CACHE_BUTTON,
    CLEAR_CACHE_CONFIRM,
    CLEAR_CACHE_ERROR,
    CLEAR_CACHE_SUCCESS,
    CLEAR_CACHE_TITLE,
    CLEARING_CACHE,
    CANCEL_BUTTON_LABEL,
    COMMON_YES_BUTTON_TITLE,
    HOME_TITLE,
    LOGIN_TITLE,
    LOGOUT_TITLE,
    MENU_BUTTON,
    MY_PROFILE,
    SCHEDULE_TITLE,
    SEMESTER_LABEL,
} from '../../constants/translationLabels/common';
import {axiosCall} from "../../services/axios";
import {DELETE, POST} from "../../constants/methods";
import CustomDialog from "../../containers/Dialogs/CustomDialog";
import {EXPORT_SCHEDULE_XLSX_URL} from "../../constants/axios";
import {getCurrentSemesterRequsted, setSchedulePublished} from '../../actions/schedule';

const StyledMenu = withStyles({
    paper: {
        border: `1px solid ${colors.colors.BORDER}`,
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
        },
    },
}))(MenuItem);

const Header = (props) => {
    const {roles, userRole, loading, currentSemester, getCurrentSemester, schedulePublished, setSchedulePublished} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleClickUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const [cacheClearing, setCacheClearing] = useState(false);
    const [cacheDialogOpen, setCacheDialogOpen] = useState(false);
    const [cacheResultDialog, setCacheResultDialog] = useState({open: false, success: true});

    const {t} = useTranslation('common');

    useEffect(() => {
        if (userRole === roles.MANAGER && !currentSemester?.id) {
            setSemesterLoadingService(true);
            getCurrentSemester();
            axiosCall('schedules/public/status')
                .then(({data}) => setSchedulePublished(data.published))
                .catch(console.error);
        }
    }, [userRole, roles.MANAGER, getCurrentSemester]);

    const handleTogglePublish = () => {
        if (schedulePublished) {
            axiosCall('schedules/publish', DELETE)
                .then(() => setSchedulePublished(false))
                .catch(console.error);
        } else {
            axiosCall('schedules/publish', POST)
                .then(() => setSchedulePublished(true))
                .catch(console.error);
        }
        handleCloseUserMenu();
    };

    const handleClearCacheClick = () => {
        handleCloseUserMenu();
        setCacheDialogOpen(true);
    };

    const handleClearCacheConfirm = () => {
        setCacheDialogOpen(false);
        setCacheClearing(true);
        axiosCall('admin/cache/all', DELETE)
            .then(() => {
                setCacheResultDialog({open: true, success: true});
            })
            .catch(() => {
                setCacheResultDialog({open: true, success: false});
            })
            .finally(() => {
                setCacheClearing(false);
            });
    };

    const handleClearCacheCancel = () => {
        setCacheDialogOpen(false);
    };

    const handleResultDialogClose = () => {
        setCacheResultDialog({open: false, success: true});
    };

    const handleExportXlsx = () => {
        handleCloseUserMenu();
        if (!currentSemester?.id) return;
        axiosCall(`${EXPORT_SCHEDULE_XLSX_URL}${currentSemester.id}`, 'GET', null, {
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `schedule_${currentSemester.description}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(console.error);
    };

    const getUserMenu = (role) => {
        let userMenu = null;
        if (isNil(role)) {
            return (
                <Button
                    component={Link}
                    to={LOGIN_LINK}
                    variant="outlined"
                    color="default"
                >
                    <FaSignOutAlt style={{marginRight: '6px'}}/>
                    {t(LOGIN_TITLE)}
                </Button>
            );
        }
        switch (role) {
            case roles.MANAGER:
                userMenu = (
                    <div className="user-menu">
                        <Button
                            aria-controls="customized-menu"
                            aria-haspopup="true"
                            variant="outlined"
                            onClick={handleClickUserMenu}
                        >
                            {localStorage.getItem('email')}
                            <ListItemIcon>
                                <FaCaretDown fontSize="normall"/>
                            </ListItemIcon>
                        </Button>
                        <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Link
                                to={ADMIN_PAGE_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normall"/>
                                    </ListItemIcon>
                                    {t(ADMIN_TITLE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={SCHEDULE_PAGE_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClock fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(SCHEDULE_TITLE)}
                                </StyledMenuItem>
                            </Link>
                            <span
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                                role="button"
                                tabIndex="0"
                            >
                                <StyledMenuItem>
                                    <FreeRooms classScheduler={props.classScheduler}/>
                                </StyledMenuItem>
                            </span>
                            <StyledMenuItem onClick={handleTogglePublish}>
                                <ListItemIcon>
                                    {schedulePublished ? <FaEyeSlash fontSize="normal"/> : <FaEye fontSize="normal"/>}
                                </ListItemIcon>
                                {schedulePublished ? t('unpublish_schedule') : t('publish_schedule')}
                            </StyledMenuItem>
                            <StyledMenuItem onClick={handleExportXlsx} disabled={!currentSemester?.id || loading}>
                                <ListItemIcon>
                                    <FaFileExcel fontSize="normal"/>
                                </ListItemIcon>
                                {t('export_schedule_xlsx')}
                            </StyledMenuItem>
                            <StyledMenuItem onClick={handleClearCacheClick} disabled={cacheClearing}>
                                <ListItemIcon>
                                    <FaTrash fontSize="normal"/>
                                </ListItemIcon>
                                {cacheClearing ? t(CLEARING_CACHE) : t(CLEAR_CACHE_BUTTON)}
                            </StyledMenuItem>
                            <Link
                                to={MY_PROFILE_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(MY_PROFILE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={LOGOUT_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(LOGOUT_TITLE)}
                                </StyledMenuItem>
                            </Link>
                        </StyledMenu>
                    </div>
                );
                break;
            case roles.TEACHER:
                userMenu = (
                    <div className="user-menu">
                        <Button
                            aria-controls="customized-menu"
                            aria-haspopup="true"
                            variant="contained"
                            color="primary"
                            onClick={handleClickUserMenu}
                        >
                            {localStorage.getItem('email')}
                            <ListItemIcon>
                                <FaCaretDown fontSize="normal"/>
                            </ListItemIcon>
                        </Button>
                        <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Link
                                to={`${SCHEDULE_FOR_LINK}?teacher=${props.teacher?.id || ''}`}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClock fontSize="normal"/>
                                    </ListItemIcon>
                                    {t('my_schedule') || 'Мій розклад'}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={MY_LESSONS_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClipboardList fontSize="normal"/>
                                    </ListItemIcon>
                                    {t('my_lessons') || 'Мої пари'}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={MY_PROFILE_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(MY_PROFILE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={LOGOUT_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(LOGOUT_TITLE)}
                                </StyledMenuItem>
                            </Link>
                        </StyledMenu>
                    </div>
                );
                break;
            default:
                userMenu = (
                    <div className="user-menu">
                        <Button
                            aria-controls="customized-menu"
                            aria-haspopup="true"
                            variant="contained"
                            color="primary"
                            onClick={handleClickUserMenu}
                        >
                            {localStorage.getItem('email')}
                        </Button>
                        <StyledMenu
                            id="customized-menu"
                            anchorEl={anchorElUser}
                            keepMounted
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Link
                                to={LOGOUT_LINK}
                                className="navLinks"
                                style={{textDecoration: 'none'}}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal"/>
                                    </ListItemIcon>
                                    {t(LOGOUT_TITLE)}
                                </StyledMenuItem>
                            </Link>
                        </StyledMenu>
                    </div>
                );
        }
        return userMenu;
    };

    let leftLinks = null;
    let menu = null;
    const userMenu = getUserMenu(userRole);
    if (userRole === roles.MANAGER) {
        leftLinks = (
            <>
                {loading ? (
                    <span className="navLinks nav-semester">
                        <CircularProgress size={20}/>
                    </span>
                ) : (
                    <span className="navLinks nav-semester">
                    <strong>{t(SEMESTER_LABEL)}</strong>: {currentSemester.description}
                    </span>
                )}
            </>
        );
        menu = (
            <div className="menu">
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    {t(MENU_BUTTON)}
                </Button>

                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <span className="navLinks menu-semester">{currentSemester.description}</span>
                    <Link
                        to={HOME_PAGE_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall"/>
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={SCHEDULE_PAGE_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaClock fontSize="normall"/>
                            </ListItemIcon>
                            {t(SCHEDULE_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={ADMIN_PAGE_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaUser fontSize="normall"/>
                            </ListItemIcon>
                            {t(ADMIN_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <span
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                        role="button"
                        tabIndex="0"
                    >
                        <StyledMenuItem>
                            <FreeRooms classScheduler={props.classScheduler}/>
                        </StyledMenuItem>
                    </span>

                    <Link
                        to={LOGOUT_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaSignOutAlt fontSize="normall"/>
                            </ListItemIcon>
                            {t(LOGOUT_TITLE)}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    } else if (userRole === roles.TEACHER) {
        menu = (
            <div className="menu">
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    {t(MENU_BUTTON)}
                </Button>

                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <Link
                        to={HOME_PAGE_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall"/>
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={MY_LESSONS_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaClipboardList fontSize="normall"/>
                            </ListItemIcon>
                            {t('my_lessons') || 'Мої пари'}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={`${SCHEDULE_FOR_LINK}?teacher=${props.teacher?.id || ''}`}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaClock fontSize="normall"/>
                            </ListItemIcon>
                            {t('my_schedule') || 'Мій розклад'}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={LOGOUT_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaSignOutAlt fontSize="normall"/>
                            </ListItemIcon>
                            {t(LOGOUT_TITLE)}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    } else if (isNil(userRole)) {
        menu = (
            <div className="menu">
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                >
                    {t(MENU_BUTTON)}
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <Link
                        to={HOME_PAGE_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall"/>
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>
                    <Link
                        to={LOGIN_LINK}
                        className="navLinks"
                        style={{textDecoration: 'none'}}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaRunning fontSize="normall"/>
                            </ListItemIcon>
                            {t(LOGIN_TITLE)}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    }

    return (
        <>
            <header className="header">
                {menu}
                <nav className="header-blocks header-blocks_one">
                    <Link to={HOME_PAGE_LINK} className="header-logo">
                        📅 {t('app_logo_title')}
                    </Link>
                    {leftLinks}
                </nav>
                <nav className="header-blocks header-blocks_right">
                    <LanguageSelector/>
                    {userMenu}
                </nav>
            </header>

            {userRole === roles.MANAGER &&
                currentSemester?.id &&
                props.defaultSemester?.id &&
                currentSemester.id !== props.defaultSemester.id && (
                    <div className="schedule-warning-banner">
                        {t('schedule_not_default_warning', {
                            current: currentSemester.description,
                            default: props.defaultSemester.description,
                        })}
                    </div>
                )}

            <CustomDialog
                open={cacheDialogOpen}
                onClose={handleClearCacheCancel}
                title={t(CLEAR_CACHE_TITLE)}
                buttons={[
                    {
                        label: t(CANCEL_BUTTON_LABEL),
                        handleClick: handleClearCacheCancel,
                        additionClassName: 'close-button',
                    },
                    {
                        label: t(COMMON_YES_BUTTON_TITLE),
                        handleClick: handleClearCacheConfirm,
                        color: 'primary',
                    },
                ]}
            >
                {t(CLEAR_CACHE_CONFIRM)}
            </CustomDialog>

            <CustomDialog
                open={cacheResultDialog.open}
                onClose={handleResultDialogClose}
                title={t(CLEAR_CACHE_TITLE)}
                buttons={[
                    {
                        label: 'OK',
                        handleClick: handleResultDialogClose,
                        color: 'primary',
                    },
                ]}
            >
                {cacheResultDialog.success ? t(CLEAR_CACHE_SUCCESS) : t(CLEAR_CACHE_ERROR)}
            </CustomDialog>
        </>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    defaultSemester: state.schedule.defaultSemester,
    loading: state.loadingIndicator.semesterLoading,
    teacher: state.teachers.teacher,
    schedulePublished: state.schedule.schedulePublished,
});

const mapDispatchToProps = (dispatch) => ({
    getCurrentSemester: () => dispatch(getCurrentSemesterRequsted()),
    setSchedulePublished: (val) => dispatch(setSchedulePublished(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);