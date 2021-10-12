import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { Link } from 'react-router-dom';
import {
    FaCaretDown,
    FaClipboardList,
    FaClock,
    FaDoorOpen,
    FaHome,
    FaRunning,
    FaSignOutAlt,
    FaUser,
} from 'react-icons/fa';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import '../../App.scss';
import './Header.scss';
import CircularProgress from '@material-ui/core/CircularProgress';
import { links } from '../../constants/links';

import LanguageSelector from '../LanguageSelector/LanguageSelector';
import * as colors from '../../constants/schedule/colors';

import { getCurrentSemesterService } from '../../services/scheduleService';

import FreeRooms from '../../containers/FreeRooms/freeRooms';
import { setSemesterLoadingService } from '../../services/loadingService';
import {
    LOGIN_TITLE,
    ADMIN_TITLE,
    SCHEDULE_TITLE,
    MY_PROFILE,
    LOGOUT_TITLE,
    SEMESTER_LABEL,
    HOME_TITLE,
    MENU_BUTTON,
} from '../../constants/translationLabels/common';

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
    const { roles } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [anchorElUser, setAnchorElUser] = useState(null);
    const handleClickUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const { t } = useTranslation('common');

    useEffect(() => {
        if (props.userRole === roles.MANAGER) {
            setSemesterLoadingService(true);
            getCurrentSemesterService();
        }
    }, [props.userRole]);

    const getUserMenu = (userRole) => {
        let userMenu = null;
        if (isNil(userRole)) {
            return (
                <Link to={links.LOGIN} className="navLinks">
                    {t(LOGIN_TITLE)}
                </Link>
            );
        }
        switch (userRole) {
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
                                to={links.ADMIN_PAGE}
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
                                to={links.SCHEDULE_PAGE}
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
                                    <ListItemIcon>
                                        <FaDoorOpen fontSize="normal" />
                                    </ListItemIcon>
                                    <FreeRooms classScheduler={props.classScheduler} />
                                </StyledMenuItem>
                            </span>
                            <Link
                                to={links.MY_PROFILE}
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
                                to={links.LOGOUT}
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
                                to={links.TEACHER_SCHEDULE}
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
                                to={links.MY_PROFILE}
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
                                to={links.LOGOUT}
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
                                to={links.LOGOUT}
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
    const userMenu = getUserMenu(props.userRole);
    if (props.userRole === roles.MANAGER) {
        leftLinks = (
            <>
                {props.loading ? (
                    <span className="navLinks nav-semester">
                        <CircularProgress size={20} />
                    </span>
                ) : (
                    <span className="navLinks nav-semester">
                        {t(SEMESTER_LABEL)}: {props.currentSemester.description}
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
                    <span className="navLinks menu-semester">
                        {props.currentSemester.description}
                    </span>
                    <Link
                        to={links.HOME_PAGE}
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
                        to={links.SCHEDULE_PAGE}
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
                        to={links.ADMIN_PAGE}
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
                            <ListItemIcon>
                                <FaDoorOpen fontSize="normall" />
                            </ListItemIcon>
                            <FreeRooms classScheduler={props.classScheduler} />
                        </StyledMenuItem>
                    </span>

                    <Link
                        to={links.LOGOUT}
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
    } else if (props.userRole === roles.TEACHER) {
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
                        to={links.HOME_PAGE}
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
                        to={links.TEACHER_SCHEDULE}
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
                        to={links.LOGOUT}
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
    } else if (props.userRole === null || props.userRole === undefined) {
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
                        to={links.HOME_PAGE}
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
                        to={links.LOGIN}
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
                    <Link to={links.HOME_PAGE} className="navLinks">
                        {t(HOME_TITLE)}
                    </Link>
                    {leftLinks}
                </nav>
                <nav className="header-blocks header-blocks_two">{userMenu}</nav>
                <nav className="header-blocks header-blocks_three">
                    <LanguageSelector />
                </nav>
            </header>
        </>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    loading: state.loadingIndicator.semesterLoading,
});

export default connect(mapStateToProps, {})(Header);
