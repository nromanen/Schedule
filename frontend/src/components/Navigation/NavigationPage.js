import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MenuItem, Select } from '@material-ui/core';
import { isNil } from 'lodash';
import { setCurrentSemester } from '../../redux/actions';
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

const NavigationPage = (props) => {
    const { val } = props;
    const { t } = useTranslation('common');
    const classes = useStyles();
    const [value, setValue] = useState(val || 0);
    const [gen, setGen] = useState(props.name || general[0].name);
    useEffect(() => {
        setCurrentSemester();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const documentTitle = (title) => {
        document.title = t(`${title}_management_title`);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    className={classes.header}
                >
                    {tabsComponents.map((tabOne, index) => (
                        <>
                            {isNil(tabOne.length) ? (
                                <Link className={classes.nav} to={links[tabOne.name]}>
                                    <Tab
                                        className={classes.btn}
                                        key={tabOne.name}
                                        onClick={() => documentTitle(tabOne.name)}
                                        label={t(`${tabOne.name}_management_title`)}
                                        {...a11yProps(index)}
                                    />
                                </Link>
                            ) : (
                                <Select
                                    className="general MuiTab-root"
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={gen}
                                    onChange={(event) => {
                                        const { eventValue } = event.target;
                                        setGen(eventValue);
                                        documentTitle(eventValue);
                                    }}
                                >
                                    {Object.entries(tabOne).map((data, indexNested) => {
                                        return (
                                            <MenuItem
                                                className="menu-dictionary MuiTab-root"
                                                value={data[1].name}
                                                key={data[0]}
                                                {...a11yProps(indexNested)}
                                            >
                                                <Link
                                                    className={classes.nav}
                                                    to={links[data[1].name]}
                                                >
                                                    {t(`${data[1].name}_management_title`)}
                                                </Link>
                                            </MenuItem>
                                        );
                                    }, this)}
                                </Select>
                            )}
                        </>
                    ))}
                </Tabs>
            </AppBar>
        </div>
    );
};

const mapStateToProps = (state) => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne,
});

export default connect(mapStateToProps, {})(NavigationPage);
