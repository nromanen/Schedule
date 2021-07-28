import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentSemester } from '../../redux/actions';
import {Link} from 'react-router-dom';
import { links } from '../../constants/links';
import './NavigationPage.scss';
import { MenuItem, Select } from '@material-ui/core';
import { dictionary, tabs_components } from '../../constants/navigationComponents';
function TabPanel(props) {
    const { children, value, index, ...other } = props;


    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    header: {
        backgroundColor: theme.palette.info.dark
    },
    nav:{
        textDecoration:'none',
            color: '#fff',
            ':hover': {
                color: 'purple'
            }
    },
    select:{
       backgroundColor:'primary'
    },

    btn:{
        margin:0,
        width: "10px"
    }
}));

const NavigationPage = (props) => {
    const {val}=props;
    const { t } = useTranslation('common');
    const classes = useStyles();
    const [value, setValue] = useState(val?val:0);
    const [dict,setDictionary]=useState(props.name||dictionary[0].name);
    useEffect(() => {
        setCurrentSemester();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let document_title = title => {
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
                    {tabs_components.map((tab_one, index) => (

                                        <>
                                            {tab_one.length===undefined?
                                                <Link className={classes.nav}

                                                      to={links[tab_one.name]}>
                                                    <Tab className={classes.btn}
                                                        key={index + tab_one}
                                                        onClick={() => document_title(tab_one.name)}
                                                        label={t(`${tab_one.name}_management_title`)}
                                                        {...a11yProps(index)}
                                                    />
                                                </Link>:
                                                <Select className="dictionary"
                                                    labelId="demo-controlled-open-select-label"
                                                    id="demo-controlled-open-select"
                                                    value={dict}
                                                    onChange={event => {
                                                        const val=event.target.value;
                                                        setDictionary(val);
                                                        document_title(val)
                                                    }}
                                            >

                                                {
                                                    Object.entries(tab_one).map(function(data, index) {
                                                        return  (<MenuItem  value={data[1].name} key={data[0]}>
                                                            <Link className={classes.nav}

                                                                  to={links[data[1].name]}>
                                                                {t(`${ data[1].name }_management_title`)}
                                                            </Link>
                                                        </MenuItem>)
                                                    }, this)
                                                }

                                            </Select>

                                            }
                                        </>
                    ))}
                </Tabs>

            </AppBar>

        </div>
    );
};

const mapStateToProps = state => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne
});

export default connect(mapStateToProps, {})(NavigationPage);
