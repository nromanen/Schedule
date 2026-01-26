import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {isNil} from 'lodash';
import {Link} from 'react-router-dom';
import {
    FaCaretDown,
    FaClipboardList,
    FaClock,
    FaEye,
    FaEyeSlash,
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
    MY_PROFILE_LINK,
    SCHEDULE_PAGE_LINK,
    TEACHER_LIST_LINK,
    TEACHER_SCHEDULE_LINK,
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
import {getCurrentSemesterRequsted} from '../../actions/schedule';
import {axiosCall} from "../../services/axios";
import {DELETE, POST} from "../../constants/methods";
import CustomDialog from "../../containers/Dialogs/CustomDialog";

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
    const { roles, userRole, loading, currentSemester, getCurrentSemester } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleClickUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const [schedulePublished, setSchedulePublished] = useState(true);
    const [cacheClearing, setCacheClearing] = useState(false);
    const [cacheDialogOpen, setCacheDialogOpen] = useState(false);
    const [cacheResultDialog, setCacheResultDialog] = useState({ open: false, success: true });

    const { t } = useTranslation('common');

    useEffect(() => {
        if (userRole === roles.MANAGER) {
            setSemesterLoadingService(true);
            getCurrentSemester();
            axiosCall('schedules/public/status')
                .then(({ data }) => setSchedulePublished(data.published))
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
                setCacheResultDialog({ open: true, success: true });
            })
            .catch(() => {
                setCacheResultDialog({ open: true, success: false });
            })
            .finally(() => {
                setCacheClearing(false);
            });
    };

    const handleClearCacheCancel = () => {
        setCacheDialogOpen(false);
    };

    const handleResultDialogClose = () => {
        setCacheResultDialog({ open: false, success: true });
    };

    const getUserMenu = (role) => {
        let userMenu = null;
        if (isNil(role)) {
            return (
                <Link to={LOGIN_LINK} className="navLinks">
                    {t(LOGIN_TITLE)}
                </Link>
            );
        }
        switch (role) {
            case roles.MANAGER:
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
                                <FaCaretDown fontSize="normall" />
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
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normall" />
                                    </ListItemIcon>
                                    {t(ADMIN_TITLE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={SCHEDULE_PAGE_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClock fontSize="normal" />
                                    </ListItemIcon>
                                    {t(SCHEDULE_TITLE)}
                                </StyledMenuItem>
                            </Link>
                            <span
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                                role="button"
                                tabIndex="0"
                            >
                                <StyledMenuItem>
                                    <FreeRooms classScheduler={props.classScheduler} />
                                </StyledMenuItem>
                            </span>
                            <StyledMenuItem onClick={handleTogglePublish}>
                                <ListItemIcon>
                                    {schedulePublished ? <FaEyeSlash fontSize="normal" /> : <FaEye fontSize="normal" />}
                                </ListItemIcon>
                                {schedulePublished ? t('unpublish_schedule') : t('publish_schedule')}
                            </StyledMenuItem>
                            <StyledMenuItem onClick={handleClearCacheClick} disabled={cacheClearing}>
                                <ListItemIcon>
                                    <FaTrash fontSize="normal" />
                                </ListItemIcon>
                                {cacheClearing ? t(CLEARING_CACHE) : t(CLEAR_CACHE_BUTTON)}
                            </StyledMenuItem>
                            <Link
                                to={MY_PROFILE_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normal" />
                                    </ListItemIcon>
                                    {t(MY_PROFILE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={LOGOUT_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal" />
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
                                <FaCaretDown fontSize="normal" />
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
                                to={TEACHER_LIST_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClock fontSize="normal" />
                                    </ListItemIcon>
                                    {t(SCHEDULE_TITLE)}
                                </StyledMenuItem>
                            </Link>
                            <span
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={() => {
                                    handleCloseUserMenu();
                                }}
                                role="button"
                                tabIndex="0"
                            ></span>
                            <Link
                                to={MY_PROFILE_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaUser fontSize="normal" />
                                    </ListItemIcon>
                                    {t(MY_PROFILE)}
                                </StyledMenuItem>
                            </Link>
                            <Link
                                to={LOGOUT_LINK}
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal" />
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
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaSignOutAlt fontSize="normal" />
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
                        <CircularProgress size={20} />
                    </span>
                ) : (
                    <span className="navLinks nav-semester">
                        {t(SEMESTER_LABEL)}: {currentSemester.description}
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
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall" />
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={SCHEDULE_PAGE_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaClock fontSize="normall" />
                            </ListItemIcon>
                            {t(SCHEDULE_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={ADMIN_PAGE_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaUser fontSize="normall" />
                            </ListItemIcon>
                            {t(ADMIN_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <span
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                        role="button"
                        tabIndex="0"
                    >
                        <StyledMenuItem>
                            <FreeRooms classScheduler={props.classScheduler} />
                        </StyledMenuItem>
                    </span>

                    <Link
                        to={LOGOUT_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaSignOutAlt fontSize="normall" />
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
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall" />
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <FaClipboardList fontSize="normall" />
                        </ListItemIcon>
                    </StyledMenuItem>

                    <Link
                        to={TEACHER_SCHEDULE_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaClock fontSize="normall" />
                            </ListItemIcon>
                            {t(SCHEDULE_TITLE)}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={LOGOUT_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaSignOutAlt fontSize="normall" />
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
                        style={{ textDecoration: 'none' }}
                        onClick={() => {
                            setAnchorEl(null);
                        }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall" />
                            </ListItemIcon>
                            {t(HOME_TITLE)}
                        </StyledMenuItem>
                    </Link>
                    <Link
                        to={LOGIN_LINK}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaRunning fontSize="normall" />
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
                    <Link to={HOME_PAGE_LINK} className="navLinks">
                        {t(HOME_TITLE)}
                    </Link>
                    {leftLinks}
                </nav>
                <nav className="header-blocks header-blocks_two">{userMenu}</nav>
                <nav className="header-blocks header-blocks_three">
                    <LanguageSelector />
                </nav>
            </header>

            <CustomDialog
                open={cacheDialogOpen}
                onClose={handleClearCacheCancel}
                title={t(CLEAR_CACHE_TITLE)}
                buttons={[
                    {
                        label: t(CANCEL_BUTTON_LABEL),
                        handleClick: handleClearCacheCancel,
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
    loading: state.loadingIndicator.semesterLoading,
});

const mapDispatchToProps = (dispatch) => ({
    getCurrentSemester: () => dispatch(getCurrentSemesterRequsted()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);