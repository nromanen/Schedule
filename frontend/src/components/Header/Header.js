import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { Link } from 'react-router-dom';
import {
    FaCaretDown,
    FaClipboardList,
    FaClock,
    FaEye,
    FaEyeSlash,
    FaFileExcel,
    FaHome,
    FaRunning,
    FaSignOutAlt,
    FaTrash,
    FaUser,
} from 'react-icons/fa';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
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
import { setSemesterLoadingService } from '../../services/loadingService';
import {
    ADMIN_TITLE,
    CLEAR_CACHE_BUTTON,
    CLEAR_CACHE_CONFIRM,
    CLEAR_CACHE_ERROR,
    CLEAR_CACHE_SUCCESS,
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
    CLEAR_CACHE_TITLE,
} from '../../constants/translationLabels/common';
import { axiosCall } from '../../services/axios';
import { DELETE, POST } from '../../constants/methods';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { EXPORT_SCHEDULE_XLSX_URL } from '../../constants/axios';
import { getCurrentSemesterRequsted, setSchedulePublished } from '../../actions/schedule';

// ─── Styled MUI components ────────────────────────────────────────────────────

const StyledMenu = withStyles({
    paper: {
        border: `1px solid ${colors.colors.BORDER}`,
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

// ─── Hooks ────────────────────────────────────────────────────────────────────

const useMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    return {
        anchorEl,
        open: Boolean(anchorEl),
        handleOpen: (e) => setAnchorEl(e.currentTarget),
        handleClose: () => setAnchorEl(null),
    };
};

const useCacheClearing = () => {
    const [clearing, setClearing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [resultDialog, setResultDialog] = useState({ open: false, success: true });

    const handleClick = () => setDialogOpen(true);
    const handleCancel = () => setDialogOpen(false);
    const handleResultClose = () => setResultDialog({ open: false, success: true });

    const handleConfirm = () => {
        setDialogOpen(false);
        setClearing(true);
        axiosCall('admin/cache/all', DELETE)
            .then(() => setResultDialog({ open: true, success: true }))
            .catch(() => setResultDialog({ open: true, success: false }))
            .finally(() => setClearing(false));
    };

    return {
        clearing,
        dialogOpen,
        resultDialog,
        handleClick,
        handleCancel,
        handleConfirm,
        handleResultClose,
    };
};

// ─── Shared components ────────────────────────────────────────────────────────

const NavMenuItem = React.forwardRef(({ to, icon: Icon, label, onClick }, ref) => (
    <Link to={to} ref={ref} className="navLinks" style={{ textDecoration: 'none' }} onClick={onClick}>
        <StyledMenuItem>
            <ListItemIcon>
                <Icon fontSize="normal" />
            </ListItemIcon>
            {label}
        </StyledMenuItem>
    </Link>
));

NavMenuItem.displayName = 'NavMenuItem';

// ─── Role-based menus ─────────────────────────────────────────────────────────

const ManagerHamburgerMenu = ({ menu, currentSemester, classScheduler, t }) => (
    <>
        <span className="navLinks menu-semester">{currentSemester.description}</span>
        <NavMenuItem to={HOME_PAGE_LINK}     icon={FaHome}      label={t(HOME_TITLE)}     onClick={menu.handleClose} />
        <NavMenuItem to={SCHEDULE_PAGE_LINK} icon={FaClock}     label={t(SCHEDULE_TITLE)} onClick={menu.handleClose} />
        <NavMenuItem to={ADMIN_PAGE_LINK}    icon={FaUser}      label={t(ADMIN_TITLE)}    onClick={menu.handleClose} />
        <span
            className="navLinks"
            style={{ textDecoration: 'none' }}
            onClick={menu.handleClose}
            role="button"
            tabIndex="0"
        >
            <StyledMenuItem>
                <FreeRooms classScheduler={classScheduler} />
            </StyledMenuItem>
        </span>
        <NavMenuItem to={LOGOUT_LINK} icon={FaSignOutAlt} label={t(LOGOUT_TITLE)} onClick={menu.handleClose} />
    </>
);

const TeacherHamburgerMenu = ({ menu, teacherId, t }) => (
    <>
        <NavMenuItem to={HOME_PAGE_LINK}                                          icon={FaHome}          label={t(HOME_TITLE)}    onClick={menu.handleClose} />
        <NavMenuItem to={MY_LESSONS_LINK}                                         icon={FaClipboardList} label={t('my_lessons')}  onClick={menu.handleClose} />
        <NavMenuItem to={`${SCHEDULE_FOR_LINK}?teacher=${teacherId || ''}`}       icon={FaClock}         label={t('my_schedule')} onClick={menu.handleClose} />
        <NavMenuItem to={LOGOUT_LINK}                                             icon={FaSignOutAlt}    label={t(LOGOUT_TITLE)}  onClick={menu.handleClose} />
    </>
);

const GuestHamburgerMenu = ({ menu, t }) => (
    <>
        <NavMenuItem to={HOME_PAGE_LINK} icon={FaHome}    label={t(HOME_TITLE)}  onClick={menu.handleClose} />
        <NavMenuItem to={LOGIN_LINK}     icon={FaRunning} label={t(LOGIN_TITLE)} onClick={menu.handleClose} />
    </>
);

const ManagerUserMenu = ({ menu, currentSemester, classScheduler, schedulePublished, onTogglePublish, onExportXlsx, onClearCache, cacheClearing, loading, t }) => {
    const email = localStorage.getItem('email');
    return (
        <div className="user-menu">
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={menu.handleOpen}
            >
                {email}
                <ListItemIcon>
                    <FaCaretDown fontSize="normal" />
                </ListItemIcon>
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={menu.anchorEl}
                keepMounted
                open={menu.open}
                onClose={menu.handleClose}
            >
                <NavMenuItem to={ADMIN_PAGE_LINK}    icon={FaUser}      label={t(ADMIN_TITLE)}    onClick={menu.handleClose} />
                <NavMenuItem to={SCHEDULE_PAGE_LINK} icon={FaClock}     label={t(SCHEDULE_TITLE)} onClick={menu.handleClose} />
                <span
                    className="navLinks"
                    style={{ textDecoration: 'none' }}
                    onClick={menu.handleClose}
                    role="button"
                    tabIndex="0"
                >
                    <StyledMenuItem>
                        <FreeRooms classScheduler={classScheduler} />
                    </StyledMenuItem>
                </span>
                <StyledMenuItem onClick={onTogglePublish}>
                    <ListItemIcon>
                        {schedulePublished ? <FaEyeSlash fontSize="normal" /> : <FaEye fontSize="normal" />}
                    </ListItemIcon>
                    {schedulePublished ? t('unpublish_schedule') : t('publish_schedule')}
                </StyledMenuItem>
                <StyledMenuItem onClick={onExportXlsx} disabled={!currentSemester?.id || loading}>
                    <ListItemIcon>
                        <FaFileExcel fontSize="normal" />
                    </ListItemIcon>
                    {t('export_schedule_xlsx')}
                </StyledMenuItem>
                <StyledMenuItem onClick={onClearCache} disabled={cacheClearing}>
                    <ListItemIcon>
                        <FaTrash fontSize="normal" />
                    </ListItemIcon>
                    {cacheClearing ? t(CLEARING_CACHE) : t(CLEAR_CACHE_BUTTON)}
                </StyledMenuItem>
                <NavMenuItem to={MY_PROFILE_LINK} icon={FaUser}      label={t(MY_PROFILE)}    onClick={menu.handleClose} />
                <NavMenuItem to={LOGOUT_LINK}     icon={FaSignOutAlt} label={t(LOGOUT_TITLE)} onClick={menu.handleClose} />
            </StyledMenu>
        </div>
    );
};

const TeacherUserMenu = ({ menu, teacherId, t }) => {
    const email = localStorage.getItem('email');
    return (
        <div className="user-menu">
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={menu.handleOpen}
            >
                {email}
                <ListItemIcon>
                    <FaCaretDown fontSize="normal" />
                </ListItemIcon>
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={menu.anchorEl}
                keepMounted
                open={menu.open}
                onClose={menu.handleClose}
            >
                <NavMenuItem to={`${SCHEDULE_FOR_LINK}?teacher=${teacherId || ''}`} icon={FaClock}         label={t('my_schedule')} onClick={menu.handleClose} />
                <NavMenuItem to={MY_LESSONS_LINK}                                   icon={FaClipboardList} label={t('my_lessons')}  onClick={menu.handleClose} />
                <NavMenuItem to={MY_PROFILE_LINK}                                   icon={FaUser}          label={t(MY_PROFILE)}    onClick={menu.handleClose} />
                <NavMenuItem to={LOGOUT_LINK}                                       icon={FaSignOutAlt}    label={t(LOGOUT_TITLE)}  onClick={menu.handleClose} />
            </StyledMenu>
        </div>
    );
};

const DefaultUserMenu = ({ menu, t }) => {
    const email = localStorage.getItem('email');
    return (
        <div className="user-menu">
            <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={menu.handleOpen}
            >
                {email}
            </Button>
            <StyledMenu
                id="customized-menu"
                anchorEl={menu.anchorEl}
                keepMounted
                open={menu.open}
                onClose={menu.handleClose}
            >
                <NavMenuItem to={LOGOUT_LINK} icon={FaSignOutAlt} label={t(LOGOUT_TITLE)} onClick={menu.handleClose} />
            </StyledMenu>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

const Header = (props) => {
    const {
        roles,
        userRole,
        loading,
        currentSemester,
        getCurrentSemester,
        schedulePublished,
        setSchedulePublished,
        classScheduler,
        teacher,
        defaultSemester,
    } = props;

    const { t } = useTranslation('common');
    const hamburgerMenu = useMenu();
    const userMenu = useMenu();
    const cache = useCacheClearing();

    useEffect(() => {
        if (userRole === roles.MANAGER && !currentSemester?.id) {
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
        userMenu.handleClose();
    };

    const handleExportXlsx = () => {
        userMenu.handleClose();
        if (!currentSemester?.id) return;
        axiosCall(`${EXPORT_SCHEDULE_XLSX_URL}${currentSemester.id}`, 'GET', null, { responseType: 'blob' })
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

    const handleClearCache = () => {
        userMenu.handleClose();
        cache.handleClick();
    };

    // ── Hamburger menu ──
    let menu = null;
    let leftLinks = null;

    if (userRole === roles.MANAGER) {
        leftLinks = (
            <span className="navLinks nav-semester">
                {loading
                    ? <CircularProgress size={20} />
                    : <><strong>{t(SEMESTER_LABEL)}</strong>: {currentSemester.description}</>
                }
            </span>
        );
        menu = (
            <div className="menu">
                <Button aria-controls="customized-menu" aria-haspopup="true" variant="contained" color="primary" onClick={hamburgerMenu.handleOpen}>
                    {t(MENU_BUTTON)}
                </Button>
                <StyledMenu id="customized-menu" anchorEl={hamburgerMenu.anchorEl} keepMounted open={hamburgerMenu.open} onClose={hamburgerMenu.handleClose}>
                    <ManagerHamburgerMenu menu={hamburgerMenu} currentSemester={currentSemester} classScheduler={classScheduler} t={t} />
                </StyledMenu>
            </div>
        );
    } else if (userRole === roles.TEACHER) {
        menu = (
            <div className="menu">
                <Button aria-controls="customized-menu" aria-haspopup="true" variant="contained" color="primary" onClick={hamburgerMenu.handleOpen}>
                    {t(MENU_BUTTON)}
                </Button>
                <StyledMenu id="customized-menu" anchorEl={hamburgerMenu.anchorEl} keepMounted open={hamburgerMenu.open} onClose={hamburgerMenu.handleClose}>
                    <TeacherHamburgerMenu menu={hamburgerMenu} teacherId={teacher?.id} t={t} />
                </StyledMenu>
            </div>
        );
    } else if (isNil(userRole)) {
        menu = (
            <div className="menu">
                <Button aria-controls="customized-menu" aria-haspopup="true" variant="contained" color="primary" onClick={hamburgerMenu.handleOpen}>
                    {t(MENU_BUTTON)}
                </Button>
                <StyledMenu id="customized-menu" anchorEl={hamburgerMenu.anchorEl} keepMounted open={hamburgerMenu.open} onClose={hamburgerMenu.handleClose}>
                    <GuestHamburgerMenu menu={hamburgerMenu} t={t} />
                </StyledMenu>
            </div>
        );
    }

    // ── User dropdown ──
    let userMenuEl = null;

    if (isNil(userRole)) {
        userMenuEl = (
            <Button component={Link} to={LOGIN_LINK} variant="outlined" color="default">
                <FaSignOutAlt style={{ marginRight: '6px' }} />
                {t(LOGIN_TITLE)}
            </Button>
        );
    } else if (userRole === roles.MANAGER) {
        userMenuEl = (
            <ManagerUserMenu
                menu={userMenu}
                currentSemester={currentSemester}
                classScheduler={classScheduler}
                schedulePublished={schedulePublished}
                onTogglePublish={handleTogglePublish}
                onExportXlsx={handleExportXlsx}
                onClearCache={handleClearCache}
                cacheClearing={cache.clearing}
                loading={loading}
                t={t}
            />
        );
    } else if (userRole === roles.TEACHER) {
        userMenuEl = <TeacherUserMenu menu={userMenu} teacherId={teacher?.id} t={t} />;
    } else {
        userMenuEl = <DefaultUserMenu menu={userMenu} t={t} />;
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
                    <LanguageSelector />
                    {userMenuEl}
                </nav>
            </header>

            {userRole === roles.MANAGER &&
                currentSemester?.id &&
                defaultSemester?.id &&
                currentSemester.id !== defaultSemester.id && (
                    <div className="schedule-warning-banner">
                        {t('schedule_not_default_warning', {
                            current: currentSemester.description,
                            default: defaultSemester.description,
                        })}
                    </div>
                )}

            <CustomDialog
                open={cache.dialogOpen}
                onClose={cache.handleCancel}
                title={t(CLEAR_CACHE_TITLE)}
                buttons={[
                    { label: t(CANCEL_BUTTON_LABEL), handleClick: cache.handleCancel, additionClassName: 'close-button' },
                    { label: t(COMMON_YES_BUTTON_TITLE), handleClick: cache.handleConfirm, color: 'primary' },
                ]}
            >
                {t(CLEAR_CACHE_CONFIRM)}
            </CustomDialog>

            <CustomDialog
                open={cache.resultDialog.open}
                onClose={cache.handleResultClose}
                title={t(CLEAR_CACHE_TITLE)}
                buttons={[
                    { label: 'OK', handleClick: cache.handleResultClose, color: 'primary' },
                ]}
            >
                {cache.resultDialog.success ? t(CLEAR_CACHE_SUCCESS) : t(CLEAR_CACHE_ERROR)}
            </CustomDialog>
        </>
    );
};

// ─── Redux ────────────────────────────────────────────────────────────────────

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