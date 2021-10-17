import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { MenuItem, Select, List, AppBar, ListItem, ListItemText } from '@material-ui/core';
import { isNil } from 'lodash';
import { setCurrentSemester } from '../../actions';
import { links } from '../../constants/links';
import './NavigationPage.scss';
import { general, tabsComponents } from '../../constants/navigationComponents';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        backgroundColor: theme.palette.info.dark,
    },
    nav: {
        textDecoration: 'none',
        color: '#fff',
        ':hover': {
            color: 'purple',
        },
    },
    select: {
        backgroundColor: 'primary',
    },

    btn: {
        margin: 0,
        width: '10px',
    },
}));

const NavigationPage = () => {
    const history = useHistory();
    const { t } = useTranslation('common');
    const classes = useStyles();
    const [gen, setGen] = useState('');
    const [selectedTab, setSelectedTab] = useState('');

    const getCurrentTabNameByUrl = () => {
        const pathName = history.location.pathname.split('/');
        pathName.shift();
        return pathName[1];
    };

    useEffect(() => {
        const tabByUrl = getCurrentTabNameByUrl();
        if (tabsComponents.indexOf(tabByUrl) === -1) {
            setSelectedTab(tabsComponents.length);
        } else {
            setSelectedTab(tabsComponents.indexOf(tabByUrl));
        }
    }, []);

    const documentTitle = (title) => {
        document.title = t(`${title}_management_title`);
    };
    const handleNavigate = (navigateTo, index) => {
        setSelectedTab(index);
        documentTitle(navigateTo);
        history.push(navigateTo);
    };

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
    };
    return (
        <Paper className={classes.root}>
            <List style={flexContainer} indicatorColor="primary" className={classes.header}>
                {tabsComponents.map((itemTitle, index) => (
                    <ListItem
                        selected={selectedTab === index}
                        key={itemTitle}
                        onClick={() => handleNavigate(itemTitle, index)}
                        {...a11yProps(index)}
                    >
                        <ListItemText>{t(`${itemTitle}_management_title`)}</ListItemText>
                    </ListItem>
                ))}
                <ListItem selected={selectedTab === tabsComponents.length}>
                    <Select
                        className="general MuiTab-root"
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={gen}
                        displayEmpty
                        onChange={(event) => {
                            const { value: eventValue } = event.target;
                            setGen(eventValue);
                            handleNavigate(eventValue, tabsComponents.length);
                        }}
                    >
                        <MenuItem
                            value=""
                            disabled
                            selected
                            className="menu-dictionary MuiTab-root"
                            {...a11yProps(0)}
                        >
                            More
                        </MenuItem>
                        {general.map((itemTitle, index) => (
                            <MenuItem
                                className="menu-dictionary MuiTab-root"
                                value={itemTitle}
                                key={itemTitle}
                                {...a11yProps(index)}
                            >
                                {t(`${itemTitle}_management_title`)}
                            </MenuItem>
                        ))}
                    </Select>
                </ListItem>
            </List>
        </Paper>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(NavigationPage);
