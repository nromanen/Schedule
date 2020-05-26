import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    FaHome,
    FaClock,
    FaUser,
    FaWindowClose,
    FaRunning,
    FaClipboardList,
    FaDoorOpen
} from 'react-icons/fa';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import '../../App.scss';
import './Header.scss';
import { links } from '../../constants/links';

import LanguageSelector from '../LanguageSelector/LanguageSelector';
import * as colors from '../../constants/schedule/colors';
import { getMyTeacherWishesService } from '../../services/teacherWishService';

import WishModal from '../../containers/WishModal/WishModal';
import { getScheduleItemsService } from '../../services/scheduleService';

import FreeRooms from '../../containers/FreeRooms/freeRooms';

const StyledMenu = withStyles({
    paper: {
        border: `1px solid ${colors.colors.BORDER}`
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white
        }
    }
}))(MenuItem);

const Header = props => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const { t } = useTranslation('common');

    const [openWish, setOpenWish] = useState(false);
    const [teacher, setTeacher] = useState(0);

    useEffect(() => {
        if (props.userRole === roles.MANAGER) getScheduleItemsService();
    }, []);

    const handleClickOpenWish = teacher => {
        setTeacher(teacher);
        setOpenWish(true);
    };

    const handleCloseWish = value => {
        setOpenWish(false);
    };

    const roles = props.roles;

    let leftLinks = null;
    let rightLinks = null;
    let menu = null;
    if (props.userRole === roles.MANAGER) {
        leftLinks = (
            <>
                <Link to={links.SCHEDULE_PAGE} className="navLinks">
                    {t('schedule_title')}
                </Link>
                <span className="navLinks nav-semester">
                    {t('formElements:semester_label')}:{' '}
                    {props.currentSemester.description}
                </span>
            </>
        );
        rightLinks = (
            <>
                <FreeRooms classScheduler={props.classScheduler} />
                <Link to={links.ADMIN_PAGE} className="navLinks">
                    {t('admin_title')}
                </Link>
                <Link to={links.LOGOUT} className="navLinks">
                    {t('logout_title')}
                </Link>
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
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaUser fontSize="normall" />
                            </ListItemIcon>
                            {t('admin_title')}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaDoorOpen fontSize="normall" />
                            </ListItemIcon>
                            <FreeRooms classScheduler={props.classScheduler} />
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={links.LOGOUT}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaWindowClose fontSize="normall" />
                            </ListItemIcon>
                            {t('logout_title')}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    } else if (props.userRole === roles.TEACHER) {
        leftLinks = (
            <>
                <span
                    className="navLinks"
                    onClick={() => {
                        handleClickOpenWish(props.myWishes[0].teacher);
                        getMyTeacherWishesService();
                    }}
                >
                    {t('wishes_title')}
                </span>
                <Link to={links.TEACHER_SCHEDULE} className="navLinks">
                    {t('schedule_title')}
                </Link>
            </>
        );
        rightLinks = (
            <Link to={links.LOGOUT} className="navLinks">
                {t('logout_title')}
            </Link>
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
                    <StyledMenuItem>
                        <ListItemIcon>
                            <FaClipboardList fontSize="normall" />
                        </ListItemIcon>

                        <span
                            className="navLinks"
                            onClick={() => {
                                handleClickOpenWish(props.myWishes[0].teacher);
                                getMyTeacherWishesService();
                            }}
                        >
                            {t('wishes_title')}
                        </span>
                    </StyledMenuItem>

                    <Link
                        to={links.TEACHER_SCHEDULE}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaWindowClose fontSize="normall" />
                            </ListItemIcon>
                            {t('schedule_title')}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={links.LOGOUT}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaWindowClose fontSize="normall" />
                            </ListItemIcon>
                            {t('logout_title')}
                        </StyledMenuItem>
                    </Link>
                </StyledMenu>
            </div>
        );
    } else if (props.userRole) {
        rightLinks = (
            <>
                <Link to={links.LOGOUT} className="navLinks">
                    {t('logout_title')}
                </Link>
            </>
        );
    } else {
        rightLinks = (
            <>
                <Link to={links.AUTH} className="navLinks">
                    {t('login_title')}
                </Link>
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
                    <Link
                        to={links.HOME_PAGE}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
                    >
                        <StyledMenuItem>
                            <ListItemIcon>
                                <FaHome fontSize="normall" />
                            </ListItemIcon>
                            {t('home_title')}
                        </StyledMenuItem>
                    </Link>

                    <Link
                        to={links.AUTH}
                        className="navLinks"
                        style={{ textDecoration: 'none' }}
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
                <nav className="header-blocks header-blocks_two">
                    {rightLinks}
                </nav>

                <nav className="header-blocks header-blocks_three">
                    <LanguageSelector />
                </nav>
            </header>
        </>
    );
};

const mapStateToProps = state => ({
    myWishes: state.teachersWish.myWishes,
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    teacherWishes: state.teachersWish.wishes
});

export default connect(mapStateToProps, {})(Header);
