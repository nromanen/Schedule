import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import LessonPage from '../LessonPage/LessonPage';
import TeacherList from '../TeachersList/TeachersList';
import ClassSchedule from '../ClassSchedule/ClassSchedule';
import GroupList from '../GroupList/GroupList';
import RoomList from '../RoomList/RoomList';
import SubjectPage from '../SubjectPage/SubjectPage';
import BusyRooms from '../BusyRooms/BusyRooms';
import SemesterPage from '../SemesterPage/SemesterPage';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MergeRolePage from '../MergeRolePage/MergeRolePage';
import { setCurrentSemester } from '../../redux/actions';

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
    }
}));

const SimpleTabs = props => {
    const { t } = useTranslation('common');
    const classes = useStyles();
    const [value, setValue] = useState(0);

    useEffect(() => {
        setCurrentSemester();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let document_title = title => {
        document.title = t(`${title}_management_title`);
    };

    const tabs_components = [
        { name: 'LessonPage', component: <LessonPage /> },
        { name: 'TeacherList', component: <TeacherList /> },
        { name: 'GroupList', component: <GroupList /> },
        { name: 'ClassSchedule', component: <ClassSchedule /> },
        { name: 'RoomList', component: <RoomList /> },
        { name: 'SubjectPage', component: <SubjectPage /> },
        { name: 'BusyRooms', component: <BusyRooms /> },
        { name: 'SemesterPage', component: <SemesterPage /> },
        { name: 'MergeRolePage', component: <MergeRolePage /> }
    ];

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
                        <Tab
                            key={index + tab_one}
                            className={classes.tabLink}
                            onClick={() => document_title(tab_one.name)}
                            label={t(`${tab_one.name}_management_title`)}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </AppBar>

            {tabs_components.map((component, index) => (
                <TabPanel key={index} value={value} index={index}>
                    {component.component}
                </TabPanel>
            ))}
        </div>
    );
};

const mapStateToProps = state => ({
    classScheduler: state.classActions.classScheduler,
    ClassScheduleOne: state.classActions.classScheduleOne
});

export default connect(mapStateToProps, {})(SimpleTabs);
