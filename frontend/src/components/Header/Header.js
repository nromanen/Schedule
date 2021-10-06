import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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
import { getMyTeacherWishesService } from '../../services/teacherWishService';

import WishModal from '../../containers/WishModal/WishModal';
import { getCurrentSemesterService } from '../../services/scheduleService';

import FreeRooms from '../../containers/FreeRooms/freeRooms';
import { setSemesterLoadingService } from '../../services/loadingService';

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const handleClickUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const { t } = useTranslation('common');

    const [openWish, setOpenWish] = useState(false);
    const [teacher, setTeacher] = useState(0);

    useEffect(() => {
        if (props.userRole === roles.MANAGER) {
            setSemesterLoadingService(true);
            getCurrentSemesterService();
        }
    }, [props.userRole]);

    const handleClickOpenWish = (teacher) => {
        setTeacher(teacher);
        setOpenWish(true);
    };

    const handleCloseWish = (value) => {
        setOpenWish(false);
    };
    const getUserMenu = (userRole) => {
        let userMenu = null;
        if (userRole === null || userRole === undefined) {
            return (
                <Link to={links.LOGIN} className="navLinks">
                    {t('login_title')}
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
                                    {t('admin_title')}
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
                                    {t('schedule_title')}
                                </StyledMenuItem>
                            </Link>
                            <span
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={handleCloseUserMenu}
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
                                    {t('my_profile')}
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
                                    {t('logout_title')}
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
                                    {t('schedule_title')}
                                </StyledMenuItem>
                            </Link>
                            <span
                                className="navLinks"
                                style={{ textDecoration: 'none' }}
                                onClick={() => {
                                    handleClickOpenWish(props.myWishes[0].teacher);
                                    getMyTeacherWishesService();
                                    handleCloseUserMenu();
                                }}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <FaClipboardList fontSize="normal" />
                                    </ListItemIcon>
                                    {t('wishes_title')}
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
                                    {t('my_profile')}
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
                                    {t('logout_title')}
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
                                    {t('logout_title')}
                                </StyledMenuItem>
                            </Link>
                        </StyledMenu>
                    </div>
                );
        }
        return userMenu;
    };

    const roles = props.roles;

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
                        {t('formElements:semester_label')}: {props.currentSemester.description}
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
                    {t('menu_button')}
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
                            {t('home_title')}
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
                            {t('schedule_title')}
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
                            {t('admin_title')}
                        </StyledMenuItem>
                    </Link>

                    <span
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                        onClick={handleClose}
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
                            {t('logout_title')}
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
                    {t('menu_button')}
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
                            {t('home_title')}
                        </StyledMenuItem>
                    </Link>
                    <StyledMenuItem>
                        <ListItemIcon>
                            <FaClipboardList fontSize="normall" />
                        </ListItemIcon>
                        <span
                            className="navLinks"
                            onClick={() => {
                                handleClickOpenWish(props.myWishes[0].teacher);
                                getMyTeacherWishesService();
                                handleClose();
                            }}
                        >
                            {t('wishes_title')}
                        </span>
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
                            {t('schedule_title')}
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
                            {t('logout_title')}
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
                    {t('menu_button')}
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
                            {t('home_title')}
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
                            {t('login_title')}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    }

    return (
        <>
            {props.userRole === roles.TEACHER ? (
                <>
                    <WishModal
                        openWish={openWish}
                        onCloseWish={handleCloseWish}
                        teacher={teacher}
                        teacherWishes={props.teacherWishes}
                        classScheduler={props.classScheduler}
                    />
                </>
            ) : (
                ''
            )}
            <header className="header">
                {menu}
                <nav className="header-blocks header-blocks_one">
                    <Link to={links.HOME_PAGE} className="navLinks">
                        {t('home_title')}
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
    myWishes: state.teachersWish.myWishes,
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    teacherWishes: state.teachersWish.wishes,
    loading: state.loadingIndicator.semesterLoading,
});

export default connect(mapStateToProps, {})(Header);
