import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { MenuItem, Select, List, ListItem, ListItemText } from '@material-ui/core';
import './NavigationPage.scss';
import { general, tabsComponents } from '../../constants/navigationComponents';
import { links } from '../../constants/links';

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
        history.push({ ...history.location, pathname: `${links.ADMIN_PAGE}/${navigateTo}` });
    };

    const flexContainer = {
        display: 'flex',
        flexDirection: 'row',
        padding: 5,
    };
    return (
        <Paper className={classes.root}>
            <List style={flexContainer} indicatorColor="primary" className={classes.header}>
                {tabsComponents.map((item, index) => (
                    <ListItem
                        selected={selectedTab === index}
                        key={item.name}
                        onClick={() => handleNavigate(item.name, index)}
                        {...a11yProps(index)}
                    >
                        <ListItemText>{t(`${item.title}`)}</ListItemText>
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
                        {general.map((item, index) => (
                            <MenuItem
                                key={item.name + item.title}
                                className="menu-dictionary MuiTab-root"
                                value={item.name}
                                onClick={() => handleNavigate(item.name, tabsComponents.length)}
                                {...a11yProps(index)}
                            >
                                {t(`${item.title}`)}
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
